/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { chatService } from '../services/chat-api';
import { Message } from '../types/chat';
import { toast } from 'sonner';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const mutation = useMutation({
    mutationFn: (text: string) => chatService.sendMessage(text),
    onSuccess: (data) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'ai',
        content: data,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    },
    onError: (error: any) => {
      if (error.response?.status === 402) {
        toast.error("Bạn đã hết lượt chat miễn phí hôm nay!", {
          description: "Nâng cấp PRO để chat không giới hạn nhé.",
          action: {
            label: "Nâng cấp ngay",
            onClick: () => window.location.href = "/pricing"
          },
          duration: 10000,
        });
      } else {
        const errorMessage = error.response?.data?.message || "AI đang bận một chút, bạn thử lại sau nhé!";
        toast.error(errorMessage);
      }
    },
  });

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: (Date.now() - 1).toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    mutation.mutate(text);
  };

  return {
    messages,
    sendMessage,
    isLoading: mutation.isPending,
  };
};
