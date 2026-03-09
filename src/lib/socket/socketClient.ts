import { io, Socket } from "socket.io-client";

export interface Participant {
  userId: string;
  socketId: string;
}

export interface RoomEditPayload {
  roomId: string;
  patch: string;
  version: number;
}

export interface RoomChatPayload {
  roomId: string;
  content: string;
}

export interface RoomJoinedEvent {
  roomId: string;
  document: string;
  version: number;
  participants: Participant[];
}

export interface RoomPresenceEvent {
  participants: Participant[];
}

export interface RoomResyncEvent {
  roomId: string;
  document: string;
  version: number;
}

export interface ServerEditBroadcast {
  roomId: string;
  patch: string;
  version: number;
  userId: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  roomId: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

export interface CursorPayload {
  roomId: string;
  cursor: { line: number; ch: number };
}

export interface CursorUpdateEvent {
  userId: string;
  cursor: { line: number; ch: number };
}

export interface SocketError {
  event: string;
  message: string;
}

interface ClientToServerEvents {
  "room:join": (roomId: string) => void;
  "room:leave": (roomId: string) => void;
  "room:edit": (payload: RoomEditPayload) => void;
  "room:chat": (payload: RoomChatPayload) => void;
  "room:cursor": (payload: CursorPayload) => void;
}

interface ServerToClientEvents {
  "room:joined": (payload: RoomJoinedEvent) => void;
  "room:presence": (payload: RoomPresenceEvent) => void;
  "room:resync": (payload: RoomResyncEvent) => void;
  "room:edit": (payload: ServerEditBroadcast) => void;
  "room:new-message": (message: ChatMessage) => void;
  "room:cursor-update": (payload: CursorUpdateEvent) => void;
  "room:kicked": (payload: { roomId: string }) => void;
  error: (payload: SocketError) => void;
}

export type CollabSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createRoomSocket(accessToken: string): CollabSocket {
  const socket: CollabSocket = io(process.env.NEXT_PUBLIC_API_URL!, {
    auth: { token: accessToken },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  return socket;
}
