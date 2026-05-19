"use client";

import React from 'react';
import { RoomList } from '@/features/chat/components/admin/room-list';
import { ChatRoom } from '@/features/chat/components/admin/chat-room';
import { useStaffChat } from '@/features/chat/hooks/use-staff-chat';

export default function AdminChatPage() {
  const {
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
  } = useStaffChat();

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-3xl overflow-hidden shadow-sm border border-zinc-100">
      <div className="w-80 flex-shrink-0">
        <RoomList 
          rooms={rooms} 
          activeRoomId={activeRoomId} 
          onSelectRoom={handleSelectRoom} 
        />
      </div>
      
      <div className="flex-1">
        <ChatRoom 
          room={activeRoom}
          messages={messages}
          internalNotes={internalNotes}
          onSendMessage={sendMessage}
          onAddNote={addInternalNote}
          onClaim={() => activeRoomId && claimRoom(activeRoomId)}
          isLoading={isLoadingHistory}
        />
      </div>
    </div>
  );
}
