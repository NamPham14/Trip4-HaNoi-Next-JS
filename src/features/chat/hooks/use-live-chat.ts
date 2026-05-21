/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '../services/socket-service';
import { chatService } from '../services/chat-api';
import { ChatMessageResponse, ChatRoomResponse, Message } from '../types/chat';
import { useUser } from '@/features/auth/hooks/use-auth';

export const useLiveChat = (initialRoomId: number | null = null) => {
  const { user, isAuthenticated } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState<number | null>(initialRoomId);
  const [room, setRoom] = useState<ChatRoomResponse | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  
  const roomIdRef = useRef<number | null>(roomId);

  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  // Đặt lại trạng thái khi người dùng thay đổi - Mẫu: Điều chỉnh trạng thái trong quá trình hiển thị
  const [prevUserId, setPrevUserId] = useState<any>(user?.id);
  if (user?.id !== prevUserId) {
    setPrevUserId(user?.id);
    setMessages([]);
    setRoomId(null);
    setRoom(null);
  }

// Lấy thông tin phòng đang hoạt động khi gắn kết hoặc khi người dùng thay đổi
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    
      const fetchActiveRoom = async () => {
      try {
        const data = await chatService.getMyActiveRoom();
        if (data) {
          setRoom(data);
         // Chỉ cập nhật roomId nếu nó thực sự thay đổi để tránh vòng lặp hiển thị
          if (roomId !== data.id) {
             setRoomId(data.id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch active room', error);
      }
    };
    fetchActiveRoom();
  }, [user?.id, isAuthenticated]);

// Lấy lịch sử khi roomId được thiết lập
  const fetchHistory = useCallback(async (id: number) => {
    setIsLoadingHistory(true);
    try {
      const history = await chatService.getChatHistory(id);
      
    // Loại bỏ các tin nhắn lịch sử trùng lặp theo ID
      const uniqueHistory = history.reduce((acc: any[], current: any) => {
        if (!acc.find(item => item.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, []);

      const mappedMessages: Message[] = uniqueHistory.map((msg) => ({
        id: msg.id.toString(),
        role: msg.type === 'USER' ? 'user' : msg.type === 'STAFF' ? 'staff' : 'system',
        content: msg.content,
        mediaUrls: msg.mediaUrls,
        timestamp: new Date(msg.timestamp).getTime(),
        senderName: msg.senderName || undefined,
        senderAvatar: msg.senderAvatar || undefined,
      }));
      
      setMessages(mappedMessages);
    } catch (error) {
      console.error('Failed to fetch chat history', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const subscribeToRoom = useCallback((id: number) => {
    console.log(`[Live Chat] Subscribing to room topic: /topic/chat/${id}`);
    socketService.subscribe(`/topic/chat/${id}`, (message) => {
      const msgData: any = JSON.parse(message.body);
      console.log('[Live Chat] Received update on room topic:', msgData);
      
      // Case 1: New Message 
      if (msgData.content !== undefined) {
        const newMessage: Message = {
          id: msgData.id.toString(),
          role: msgData.type === 'USER' ? 'user' : msgData.type === 'STAFF' ? 'staff' : 'system',
          content: msgData.content,
          mediaUrls: msgData.mediaUrls,
          timestamp: new Date(msgData.timestamp).getTime(),
          senderName: msgData.senderName || undefined,
          senderAvatar: msgData.senderAvatar || undefined,
        };
        setMessages((prev) => {
          // Robust deduplication
          if (prev.find(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      } 
      // Case 2: Room Status Update (Staff joined, etc. - usually doesn't have content)
      if (msgData.status !== undefined) {
        setRoom(msgData);
        if (roomIdRef.current !== msgData.id) {
          setRoomId(msgData.id);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    socketService.connect(
      () => {
        setIsConnected(true);
        console.log('[Live Chat] Socket connected');
        
        // Topic cập nhật phòng (cho discovery)
        socketService.subscribe('/topic/chat/rooms', (message) => {
          const data = JSON.parse(message.body);
          if (data.userId === user.id) {
            console.log('[Live Chat] Discovered my room update:', data.id);
            setRoom(data);
            if (roomIdRef.current !== data.id) {
              setRoomId(data.id);
            }
          }
        });

        // Nếu đã có roomId, sub ngay
        if (roomIdRef.current) {
          subscribeToRoom(roomIdRef.current);
          fetchHistory(roomIdRef.current);
        }
      },
      (err) => {
        setIsConnected(false);
        console.error('[Live Chat] Connection error', err);
      }
    );

    return () => {
      socketService.unsubscribe('/topic/chat/rooms');
      if (roomIdRef.current) {
        socketService.unsubscribe(`/topic/chat/${roomIdRef.current}`);
      }
    };
  }, [user?.id, isAuthenticated, subscribeToRoom, fetchHistory]);

  // Effect quan trọng: Khi roomId thay đổi (do discovery hoặc fetchActiveRoom), 
  // ta cần subscribe và fetchHistory cho room đó nếu đã kết nối socket
  useEffect(() => {
    if (roomId && isConnected) {
      subscribeToRoom(roomId);
      
      const init = async () => {
        await Promise.resolve();
        fetchHistory(roomId);
      };
      init();
    }
  }, [roomId, isConnected, subscribeToRoom, fetchHistory]);

  const sendMessage = useCallback(async (content: string, files?:File[]) => {
    // dieu kien gui: phai co chu hoa co anh
    const hasContent = content.trim().length >0;
    const hasFiles = files && files.length > 0;



    if ((!hasContent && !hasFiles) || !isConnected) {
        console.warn('[Live Chat] Cannot send: not connected or empty content');
        return;
    }
    try{
       let uploadedUrls: string[] = [];
        //  Nếu có file, thực hiện upload lên Cloudinary trước
       if (hasFiles) {
          uploadedUrls = await chatService.uploadImages(files);
       }
       //  Gửi qua WebSocket kèm link ảnh
       socketService.send('/app/chat.sendMessage',{
        roomId: roomIdRef.current,
        content:content,
        mediaUrls:uploadedUrls,
       });

    }catch(error){
      console.error('[Live Chat] Error uploading images or sending message:', error);
    }
    
  }, [isConnected]);

  return {
    messages,
    sendMessage,
    isConnected,
    roomId,
    setRoomId,
    room,
    isLoadingHistory,
  };
};
