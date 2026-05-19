/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Cookies from 'js-cookie';

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8080') + '/ws';

class SocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();

  connect(onConnect: () => void, onError: (err: any) => void) {
    const token = Cookies.get('access_token');
    
    // If already connected with a different token, disconnect first
    if (this.client?.active && (this.client as any)._lastToken !== token) {
      console.log('[STOMP] Token changed, reconnecting...');
      this.disconnect();
    }

    if (this.client?.active) {
      if (this.client.connected) {
        onConnect();
      }
      return;
    }

    if (!token) {
      console.warn('[STOMP] No token found, skipping connection');
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[STOMP]', str);
        }
      },
      onConnect: () => {
        console.log('[STOMP] Connected');
        onConnect();
      },
      onStompError: (frame) => {
        console.error('[STOMP] Error', frame.body);
        onError(frame);
      },
      onDisconnect: () => {
        console.log('[STOMP] Disconnected');
      },
    });

    (this.client as any)._lastToken = token;
    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.subscriptions.clear();
      this.client = null;
    }
  }

  subscribe(topic: string, callback: (message: IMessage) => void) {
    if (!this.client?.connected) {
      console.warn('[STOMP] Cannot subscribe, not connected');
      return;
    }

    // Unsubscribe if already subscribed to this topic to avoid duplicate messages
    if (this.subscriptions.has(topic)) {
      this.unsubscribe(topic);
    }

    const subscription = this.client.subscribe(topic, callback);
    this.subscriptions.set(topic, subscription);
    return subscription;
  }

  unsubscribe(topic: string) {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  send(destination: string, body: any) {
    if (!this.client?.connected) {
      console.error('[STOMP] Cannot send message, not connected');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
  }

  isConnected() {
    return this.client?.connected || false;
  }
}

export const socketService = new SocketService();
