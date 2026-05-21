/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '../services/socket-service';
import { chatService } from '../services/chat-api';
import { ChatMessageResponse, ChatRoomResponse, Message } from '../types/chat';
import { toast } from 'sonner';
import { useUser } from '@/features/auth/hooks/use-auth';

export const useStaffChat = () => {
  const { user } = useUser();
  const [rooms, setRooms] = useState<ChatRoomResponse[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const activeRoomIdRef = useRef<number | null>(null);

  // Luôn đồng bộ Ref để callback socket dùng được ID mới nhất
  useEffect(() => {
    activeRoomIdRef.current = activeRoomId;
  }, [activeRoomId]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [internalNotes, setInternalNotes] = useState<any[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

// Đặt lại trạng thái khi người dùng thay đổi - Mẫu: Điều chỉnh trạng thái trong quá trình hiển thị
  const [prevUserId, setPrevUserId] = useState<any>(user?.id);
  if (user?.id !== prevUserId) {
    setPrevUserId(user?.id);
    setRooms([]);
    setActiveRoomId(null);
    setMessages([]);
    setInternalNotes([]);
  }

  const loadRooms = useCallback(async () => {
    if (!user) return;
    setIsLoadingRooms(true);
    try {
      const [pendingRooms, activeRooms] = await Promise.all([
        chatService.getRooms('PENDING'),
        chatService.getRooms('ACTIVE')
      ]);
      setRooms([...pendingRooms, ...activeRooms]);
    } catch (error) {
      console.error('Failed to load rooms', error);
      toast.error('Không thể tải danh sách phòng chat');
    } finally {
      setIsLoadingRooms(false);
    }
  }, [user]);

  const fetchHistory = useCallback(async (roomId: number) => {
    setIsLoadingHistory(true);
    try {
      const history = await chatService.getChatHistory(roomId);
      
// Loại bỏ tin nhắn lịch sử trùng lặp
      const uniqueHistory = history.reduce((acc: any[], current: any) => {
        if (!acc.find(item => item.id === current.id)) {
          acc.push(current);
        }
        return acc;
      }, []);

      // Tách tin nhắn và ghi chú
      const mappedMessages: Message[] = uniqueHistory
        .filter((msg: any) => !msg.content.startsWith('[GHI CHÚ]'))
        .map((msg: any) => ({
          id: msg.id.toString(),
          role: msg.type === 'USER' ? 'user' : msg.type === 'STAFF' ? 'staff' : 'system',
          content: msg.content,
          // THÊM: Map danh sách ảnh từ lịch sử
          mediaUrls: msg.mediaUrls, 
          timestamp: new Date(msg.timestamp).getTime(),
          senderName: msg.senderName || undefined,
          senderAvatar: msg.senderAvatar || undefined,
        }));
      setMessages(mappedMessages);

      const mappedNotes = uniqueHistory
        .filter((msg: any) => msg.content.startsWith('[GHI CHÚ]'))
        .map((msg: any) => ({
          id: msg.id,
          content: msg.content.replace('[GHI CHÚ] ', ''),
          authorName: msg.senderName,
          createdAt: msg.timestamp
        }));
      setInternalNotes(mappedNotes);
      
      // Reset unread local
      setRooms((prev) => prev.map(r => r.id === roomId ? { ...r, unreadCount: 0 } : r));
    } catch (error) {
      console.error('Failed to fetch history', error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    // Avoid synchronous setState in effect by making it async
    const init = async () => {
      await Promise.resolve(); // Next tick
      loadRooms();
    };
    init();

    if (!user) return;

    socketService.connect(
      () => {
        // Topic cập nhật danh sách phòng toàn cục
        socketService.subscribe('/topic/chat/rooms', (message) => {
          const updatedRoom: ChatRoomResponse = JSON.parse(message.body);
          
          setRooms((prev) => {
            // Nếu là phòng đang mở, ép unread về 0
            const isNowActive = updatedRoom.id === activeRoomIdRef.current;
            const roomToStore = isNowActive ? { ...updatedRoom, unreadCount: 0 } : updatedRoom;

            // Đưa lên đầu danh sách
            const filtered = prev.filter(r => r.id !== roomToStore.id);
            return [roomToStore, ...filtered];
          });
          
          if (updatedRoom.status === 'PENDING') {
            toast.info(`Có phòng chat mới từ ${updatedRoom.userName}`);
          }
        });

        socketService.subscribe('/topic/staff/rooms/', (message) => {
          const updatedRoom: ChatRoomResponse = JSON.parse(message.body);
          setRooms((prev) => prev.filter(r => r.id !== updatedRoom.id || updatedRoom.status === 'ACTIVE'));
        });
      },
      (err) => console.error('Socket error', err)
    );
  }, [loadRooms, user]);

  const handleSelectRoom = useCallback((id: number) => {
    setActiveRoomId(id);
    setRooms(prev => prev.map(r => r.id === id ? { ...r, unreadCount: 0 } : r));
  }, []);

  useEffect(() => {
    if (!activeRoomId) return;
    
    const init = async () => {
      await Promise.resolve();
      fetchHistory(activeRoomId);
    };
    init();
    
    socketService.subscribe(`/topic/chat/${activeRoomId}`, (message) => {
      const msgData: any = JSON.parse(message.body);
      if (msgData.content !== undefined || msgData.mediaUrls !== undefined) {
        const newMessage: Message = {
          id: msgData.id.toString(),
          role: msgData.type === 'USER' ? 'user' : msgData.type === 'STAFF' ? 'staff' : 'system',
          content: msgData.content,
          // THÊM: Nhận ảnh mới từ socket
          mediaUrls: msgData.mediaUrls, 
          timestamp: new Date(msgData.timestamp).getTime(),
          senderName: msgData.senderName || undefined,
          senderAvatar: msgData.senderAvatar || undefined,
        };
        
        setMessages((prev) => {
          if (prev.find(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });

        setRooms(prev => prev.map(r => 
            r.id === activeRoomId 
            ? { ...r, lastMessage: msgData, updatedAt: msgData.timestamp, unreadCount: 0 } 
            : r
        ));
      } else if (msgData.status !== undefined) {
        setRooms((prev) => {
          const index = prev.findIndex(r => r.id === msgData.id);
          if (index !== -1) {
            const newRooms = [...prev];
            newRooms[index] = msgData;
            return newRooms;
          }
          return prev;
        });
      }
    });

    // Subscribe to internal notes
    socketService.subscribe(`/topic/chat/${activeRoomId}/internal`, (message) => {
        const noteData: any = JSON.parse(message.body);
        const newNote = {
          id: noteData.id,
          content: noteData.content,
          authorName: noteData.authorName,
          createdAt: noteData.createdAt
        };
        
        setInternalNotes((prev) => {
          if (prev.find(n => n.id === newNote.id)) return prev;
          return [newNote, ...prev];
        });
      });

    return () => {
      socketService.unsubscribe(`/topic/chat/${activeRoomId}`);
      socketService.unsubscribe(`/topic/chat/${activeRoomId}/internal`);
    };
  }, [activeRoomId, fetchHistory]);

  const claimRoom = (roomId: number) => {
    socketService.send(`/app/chat.claimRoom.${roomId}`, {});
    setActiveRoomId(roomId);
  };

  // CẬP NHẬT: Hàm gửi tin nhắn hỗ trợ cả chữ và ảnh
  const sendMessage = async (content: string, files?: File[]) => {
    if (!activeRoomId) return;

    const hasText = content.trim().length > 0;
    const hasFiles = files && files.length > 0;

    if (!hasText && !hasFiles) return;

    try {
      let uploadedUrls: string[] = [];

      // 1. Nếu Staff có chọn ảnh, upload lên Cloudinary trước
      if (hasFiles) {
        uploadedUrls = await chatService.uploadImages(files);
      }

      // 2. Gửi qua WebSocket kèm link ảnh
      socketService.send('/app/chat.sendMessage', {
        roomId: activeRoomId,
        content: content,
        mediaUrls: uploadedUrls
      });
    } catch (error) {
      console.error('[Staff Chat] Error sending message/images:', error);
      toast.error('Gửi tin nhắn thất bại');
    }
  };

  const addInternalNote = (content: string) => {
    if (!activeRoomId || !content.trim()) return;
    socketService.send(`/app/chat.addNote.${activeRoomId}`, {
      content: content
    });
  };

  return {
    rooms,
    activeRoomId,
    handleSelectRoom,
    messages,
    internalNotes,
    isLoadingRooms,
    isLoadingHistory,
    claimRoom,
    sendMessage,
    addInternalNote,
  };
};