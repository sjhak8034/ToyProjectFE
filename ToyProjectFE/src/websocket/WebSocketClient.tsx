import { Client, type IMessage } from '@stomp/stompjs';
export interface ChatLogResponse {
  id: number;
  message: string;
  userId: number;
  senderNickname: string;
  createdAt: string;
  isMine: boolean | null; // isMine 필드 추가
}
interface Message {
  message: string;
}

export type WebSocketCallbacks = {
  onConnect?: (frame: any) => void;
  onMessage?: (message: ChatLogResponse) => void; // 타입 변경
  onError?: (error: any) => void;
  onStompError?: (frame: any) => void;
};
export function createWebSocketClient(
  topic: string,
  callbacks: WebSocketCallbacks = {}
) {
  const client = new Client({
    brokerURL: import.meta.env.VITE_WEB_SOCKET_URL || 'ws://localhost:3000/ws',
    debug: (str) => console.log(str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  client.onConnect = (frame) => {
    callbacks.onConnect?.(frame);
    client.subscribe(topic, (greeting: IMessage) => {
      let content: ChatLogResponse | null = null;
      try {
        content = JSON.parse(greeting.body) as ChatLogResponse;
      } catch {
        // 파싱 실패 시 null
        content = null;
      }
      if (content) {
        callbacks.onMessage?.(content);
      }
    });
  };

  client.onWebSocketError = (error) => {
    callbacks.onError?.(error);
  };

  client.onStompError = (frame) => {
    callbacks.onStompError?.(frame);
  };

  return {
    activate: () => client.activate(),
    deactivate: () => client.deactivate(),
    publish: (destination: string, body: Message) => {
      client.publish({
        destination,
        body: JSON.stringify(body),
      });
    },
    client,
  };
}