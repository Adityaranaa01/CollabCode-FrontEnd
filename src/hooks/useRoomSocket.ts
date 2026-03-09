"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createRoomSocket,
  CollabSocket,
  ChatMessage,
  Participant,
  RoomJoinedEvent,
  RoomPresenceEvent,
  RoomResyncEvent,
  ServerEditBroadcast,
  CursorUpdateEvent,
  SocketError,
} from "@/lib/socket/socketClient";

const MAX_PATCH_SIZE = 50 * 1024;
const MAX_MESSAGE_LENGTH = 2000;
const CURSOR_THROTTLE_MS = 75;

type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";

interface UseRoomSocketReturn {
  document: string;
  version: number;
  participants: Participant[];
  messages: ChatMessage[];
  cursors: Record<string, { line: number; ch: number }>;
  connectionStatus: ConnectionStatus;
  sendPatch: (patch: string) => void;
  sendMessage: (content: string) => void;
  sendCursor: (cursor: { line: number; ch: number }) => void;
}

export function useRoomSocket(roomId: string): UseRoomSocketReturn {
  const { accessToken, user, refreshAccessToken } = useAuth();

  const [document, setDocument] = useState("");
  const [version, setVersion] = useState(0);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [cursors, setCursors] = useState<
    Record<string, { line: number; ch: number }>
  >({});
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle");

  const socketRef = useRef<CollabSocket | null>(null);
  const versionRef = useRef(0);
  const userIdRef = useRef<string | null>(null);
  const refreshAttemptedRef = useRef(false);
  const lastCursorEmitRef = useRef(0);

  useEffect(() => {
    userIdRef.current = user?.id ?? null;
  }, [user]);

  const cleanup = useCallback(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    }
  }, []);

  const connect = useCallback(
    (token: string) => {
      cleanup();

      setConnectionStatus("connecting");

      const socket = createRoomSocket(token);
      socketRef.current = socket;

      socket.on("connect", () => {
        setConnectionStatus("connected");
        refreshAttemptedRef.current = false;
        socket.emit("room:join", roomId);
      });

      socket.on("room:joined", (payload: RoomJoinedEvent) => {
        setDocument(payload.document);
        setVersion(payload.version);
        versionRef.current = payload.version;
        setParticipants(payload.participants);
        setMessages([]);
        setCursors({});
      });

      socket.on("room:presence", (payload: RoomPresenceEvent) => {
        setParticipants(payload.participants);
      });

      socket.on("room:edit", (payload: ServerEditBroadcast) => {
        if (userIdRef.current && payload.userId === userIdRef.current) return;
        setDocument(payload.patch);
        setVersion(payload.version);
        versionRef.current = payload.version;
      });

      socket.on("room:resync", (payload: RoomResyncEvent) => {
        setDocument(payload.document);
        setVersion(payload.version);
        versionRef.current = payload.version;
      });

      socket.on("room:new-message", (message: ChatMessage) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on("room:cursor-update", (payload: CursorUpdateEvent) => {
        if (payload.userId === userIdRef.current) return;
        setCursors((prev) => ({
          ...prev,
          [payload.userId]: payload.cursor,
        }));
      });

      socket.on("room:kicked", () => {
        cleanup();
        setConnectionStatus("error");
      });

      socket.on("error", (_payload: SocketError) => {
        setConnectionStatus("error");
      });

      socket.io.on("reconnect_attempt", () => {
        setConnectionStatus("reconnecting");
      });

      socket.io.on("reconnect", () => {
        setConnectionStatus("connected");
        socket.emit("room:join", roomId);
      });

      socket.on("connect_error", async () => {
        if (refreshAttemptedRef.current) {
          setConnectionStatus("error");
          return;
        }

        refreshAttemptedRef.current = true;
        const newToken = await refreshAccessToken();

        if (newToken) {
          cleanup();
          connect(newToken);
        } else {
          setConnectionStatus("error");
        }
      });

      socket.on("disconnect", (reason) => {
        if (reason === "io server disconnect") {
          setConnectionStatus("error");
        }
      });
    },
    [roomId, cleanup, refreshAccessToken]
  );

  useEffect(() => {
    if (!accessToken || !roomId) {
      setConnectionStatus("idle");
      return;
    }

    connect(accessToken);
    return cleanup;
  }, [accessToken, roomId, connect, cleanup]);

  const sendPatch = useCallback(
    (patch: string) => {
      const socket = socketRef.current;
      if (!socket || !socket.connected) return;

      if (patch.length > MAX_PATCH_SIZE) return;

      socket.emit("room:edit", {
        roomId,
        patch,
        version: versionRef.current,
      });

      versionRef.current += 1;
    },
    [roomId]
  );

  const sendMessage = useCallback(
    (content: string) => {
      const socket = socketRef.current;
      if (!socket || !socket.connected) return;

      const trimmed = content.trim();
      if (trimmed.length === 0 || trimmed.length > MAX_MESSAGE_LENGTH) return;

      socket.emit("room:chat", { roomId, content: trimmed });
    },
    [roomId]
  );

  const sendCursor = useCallback(
    (cursor: { line: number; ch: number }) => {
      const socket = socketRef.current;
      if (!socket || !socket.connected) return;

      const now = Date.now();
      if (now - lastCursorEmitRef.current < CURSOR_THROTTLE_MS) return;
      lastCursorEmitRef.current = now;

      socket.emit("room:cursor", { roomId, cursor });
    },
    [roomId]
  );

  return {
    document,
    version,
    participants,
    messages,
    cursors,
    connectionStatus,
    sendPatch,
    sendMessage,
    sendCursor,
  };
}
