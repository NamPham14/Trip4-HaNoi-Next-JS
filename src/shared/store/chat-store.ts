import { create } from 'zustand';

export type ChatMode = "AI" | "LIVE";

interface ChatState {
  isOpen: boolean;
  chatMode: ChatMode;
  openChat: (mode?: ChatMode) => void;
  closeChat: () => void;
  toggleChat: () => void;
  setChatMode: (mode: ChatMode) => void;
}

/**
 * Global store để quản lý trạng thái hiển thị của ChatWidget.
 * Giúp mở Chat từ bất kỳ nơi nào trong ứng dụng (ví dụ: từ Notification).
 */
export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  chatMode: "AI",
  
  openChat: (mode) => set((state) => ({ 
    isOpen: true, 
    chatMode: mode || state.chatMode 
  })),
  
  closeChat: () => set({ isOpen: false }),
  
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  
  setChatMode: (mode) => set({ chatMode: mode }),
}));