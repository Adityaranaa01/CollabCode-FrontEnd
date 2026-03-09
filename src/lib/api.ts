const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body: ApiResponse<T> = await res.json();

  if (!res.ok || !body.success) {
    throw new ApiError(
      body.message || `Request failed with status ${res.status}`,
      res.status
    );
  }

  return body.data as T;
}

export interface AuthTokens {
  accessToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  plan: {
    name: string;
    maxRooms: number;
    maxMembersPerRoom: number;
    chatRetentionDays: number;
    maxActiveSessions: number;
  };
  createdAt: string;
}

export const authApi = {
  register: (email: string, username: string, password: string, displayName: string) =>
    request<AuthTokens>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, password, displayName }),
    }),

  login: (identifier: string, password: string) =>
    request<AuthTokens>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),

  refresh: () =>
    request<AuthTokens>("/api/v1/auth/refresh", {
      method: "POST",
    }),

  logout: () =>
    request<void>("/api/v1/auth/logout", {
      method: "POST",
    }).catch(() => {}),

  logoutAll: (accessToken: string) =>
    request<void>("/api/v1/auth/logout-all", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  getMe: (accessToken: string) =>
    request<UserProfile>("/api/v1/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};

export interface RoomOwner {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface Room {
  id: string;
  name: string;
  language: string;
  isPublic: boolean;
  createdAt: string;
  owner: RoomOwner;
  _count: { memberships: number };
}

export interface DashboardData {
  ownedRooms: Room[];
  joinedRooms: Room[];
  publicRooms: {
    rooms: Room[];
    nextCursor: string | null;
  };
}

export interface RoomMember {
  id: string;
  userId: string;
  roomId: string;
  role: "OWNER" | "MEMBER";
  joinedAt: string;
  user: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    email: string;
  };
}

export interface InviteResult {
  token: string;
  expiresAt: string;
}

function authHeaders(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

export const roomApi = {
  getDashboard: (accessToken: string, cursor?: string, limit?: number) => {
    const params = new URLSearchParams();
    if (cursor) params.set("cursor", cursor);
    if (limit) params.set("limit", String(limit));
    const qs = params.toString();
    return request<DashboardData>(
      `/api/v1/rooms/dashboard${qs ? `?${qs}` : ""}`,
      { headers: authHeaders(accessToken) }
    );
  },

  createRoom: (
    accessToken: string,
    data: { name: string; language: string; isPublic?: boolean }
  ) =>
    request<Room>("/api/v1/rooms", {
      method: "POST",
      headers: authHeaders(accessToken),
      body: JSON.stringify(data),
    }),

  getRoom: (accessToken: string, roomId: string) =>
    request<Room>(`/api/v1/rooms/${roomId}`, {
      headers: authHeaders(accessToken),
    }),

  deleteRoom: (accessToken: string, roomId: string) =>
    request<{ deletedRoomId: string }>(`/api/v1/rooms/${roomId}`, {
      method: "DELETE",
      headers: authHeaders(accessToken),
    }),

  joinRoom: (accessToken: string, roomId: string) =>
    request<RoomMember>(`/api/v1/rooms/${roomId}/join`, {
      method: "POST",
      headers: authHeaders(accessToken),
    }),

  createInvite: (accessToken: string, roomId: string) =>
    request<InviteResult>(`/api/v1/rooms/${roomId}/invite`, {
      method: "POST",
      headers: authHeaders(accessToken),
    }),

  joinByInvite: (accessToken: string, token: string) =>
    request<RoomMember>("/api/v1/rooms/join-by-invite", {
      method: "POST",
      headers: authHeaders(accessToken),
      body: JSON.stringify({ token }),
    }),

  joinById: (accessToken: string, roomId: string) =>
    request<RoomMember>("/api/v1/rooms/join-by-id", {
      method: "POST",
      headers: authHeaders(accessToken),
      body: JSON.stringify({ roomId }),
    }),

  getRoomMembers: (accessToken: string, roomId: string) =>
    request<RoomMember[]>(`/api/v1/rooms/${roomId}/members`, {
      headers: authHeaders(accessToken),
    }),

  removeMember: (accessToken: string, roomId: string, userId: string) =>
    request<{ removedUserId: string; roomId: string }>(
      `/api/v1/rooms/${roomId}/members/${userId}`,
      {
        method: "DELETE",
        headers: authHeaders(accessToken),
      }
    ),
};

export { ApiError };
