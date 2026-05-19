import React from 'react';
import { ChatRoomResponse } from '../../types/chat';
import { cn } from '@/shared/lib/utils';
import { MessageSquare, User, CheckCircle2 } from 'lucide-react';

interface RoomListProps {
  rooms: ChatRoomResponse[];
  activeRoomId: number | null;
  onSelectRoom: (roomId: number) => void;
}

export const RoomList = ({ rooms, activeRoomId, onSelectRoom }: RoomListProps) => {
  // Sắp xếp phòng theo thời gian cập nhật mới nhất (updatedAt)
  const sortedRooms = [...rooms].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-zinc-200">
      <div className="p-4 border-b border-zinc-200 bg-zinc-50">
        <h2 className="font-bold text-zinc-900 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#8B1D1D]" />
          Hội thoại hỗ trợ
        </h2>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
          {rooms.length} phòng đang chờ/xử lý
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {sortedRooms.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <div className="bg-zinc-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-zinc-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-xs text-zinc-500">Không có yêu cầu hỗ trợ nào</p>
          </div>
        ) : (
          sortedRooms.map((room) => {
          
            const isUnread = !!(room.unreadCount && room.unreadCount > 0 && activeRoomId !== room.id);
            const isActive = activeRoomId === room.id;

            return (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={cn(
                  "w-full p-4 flex flex-col gap-2 border-b border-zinc-100 transition-all text-left relative",
                  isActive ? "bg-zinc-100 border-l-4 border-l-zinc-800" : "hover:bg-zinc-50",
                  isUnread ? "bg-blue-50 border-l-4 border-l-blue-600 shadow-md z-10" : ""
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 overflow-hidden border border-zinc-100 relative flex-shrink-0">
                      {room.userAvatar ? (
                          <img src={room.userAvatar} alt={room.userName} className="w-full h-full object-cover" />
                      ) : (
                          <User className="h-6 w-6" />
                      )}
                      {isUnread && (
                         <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full z-20"></div>
                      )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <p className={cn(
                          "text-[15px] truncate transition-colors",
                          isUnread ? "font-black text-blue-800" : "font-semibold text-zinc-800"
                      )}>
                          {room.userName}
                      </p>
                      <div className="flex items-center gap-1">
                          <span className={cn(
                              "text-[13px] truncate pr-2",
                              isUnread ? "text-blue-700 font-bold" : "text-zinc-500"
                          )}>
                               {room.lastMessage ? (
                                  <>
                                      {room.lastMessage.type === 'STAFF' ? 'Bạn: ' : ''}
                                      {room.lastMessage.content}
                                  </>
                               ) : 'Chưa có tin nhắn'}
                          </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={cn(
                        "text-[11px]",
                        isUnread ? "font-bold text-blue-600" : "text-zinc-400"
                      )}>
                        {new Date(room.updatedAt || room.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {isUnread && (
                          <div className="flex items-center gap-1.5">
                               <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                                  {room.unreadCount} MỚI
                               </span>
                               <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                          </div>
                      )}
                  </div>
                </div>
                
                {room.staffName && (
                  <div className={cn(
                      "flex items-center gap-1 mt-1 transition-opacity",
                      isUnread ? "opacity-50" : "opacity-80"
                  )}>
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    <span className="text-[10px] text-emerald-600 font-medium">Nhân viên: {room.staffName}</span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};