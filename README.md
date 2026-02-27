# CollabCode — Frontend

Real-time collaborative coding platform built with a production-grade frontend architecture.

This repository contains the Next.js 14 frontend application for CollabCode — handling authentication flows, dashboard UI, real-time collaboration workspace, and WebSocket integration.

> **Backend Repository:** [CollabCode Backend](https://github.com/Adityaranaa01/CollabCode-Backend)

---

## Features

- Cinematic marketing landing page
- Split-layout authentication (login / signup)
- Workspace dashboard with room cards
- Real-time collaboration room (editor + chat + participants)
- Live presence tracking
- Optimistic concurrency integration
- Plan-aware UI restrictions
- Custom dark-first design system

---

## Tech Stack

- [Next.js 14](https://nextjs.org/) — App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.io Client](https://socket.io/) — Real-time communication
- [Lucide React](https://lucide.dev/) — Icons
- `next/font` — Inter + JetBrains Mono

No UI frameworks. No component libraries. No global state libraries.
All UI built from scratch.

---

## Authentication Integration

The frontend integrates with a JWT-based backend auth system:

| Concern | Implementation |
|---------|---------------|
| Access Token | 15-min JWT, stored **in memory** (React state) |
| Refresh Token | 7-day JWT, stored as **HTTP-only cookie** by backend |
| Token Refresh | Automatic on app load and periodic silent refresh |
| Route Protection | `ProtectedRoute` component via `AuthContext` |
| API Requests | All use `credentials: "include"` |

No localStorage token persistence.

---

## Real-Time Collaboration

Room collaboration integrates with the backend WebSocket server:

- **WebSocket connection** via Socket.io with JWT handshake auth
- **Optimistic concurrency** — version-based conflict detection
- **Automatic resync** on version mismatch
- **Presence tracking** — live participant list
- **Chat broadcasting** — real-time message delivery

No CRDT (intentional architectural tradeoff).

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page with animated hero |
| `/auth` | Split-layout login / signup experience |
| `/dashboard` | Room listing, creation, and management |
| `/room/[id]` | Real-time collaboration workspace |
| `/not-found` | Custom 404 page |

---

## Design System

Custom dark-first design system — no third-party UI libraries.

**Colors**

| Token | Value |
|-------|-------|
| Background | `#050308` |
| Surface | `#0d0a14` |
| Primary Purple | `#8B5CF6` |
| Accent Dark | `#16121f` |

**Typography**

| Usage | Font |
|-------|------|
| UI | Inter |
| Code | JetBrains Mono |

**Animations** — cursor blink, pulse-dot, float, fade-up, typing dots, live pulse glow. All handcrafted CSS, no animation libraries.

---

## Folder Structure

```
src/
 ├── app/              # Pages and layouts (App Router)
 │   ├── auth/         # Login / Signup
 │   ├── dashboard/    # Room management
 │   ├── room/[id]/    # Collaboration workspace
 │   └── layout.tsx    # Root layout + AuthProvider
 ├── components/       # Reusable UI components
 ├── contexts/         # AuthContext provider
 ├── lib/              # API client, utilities
 └── app/globals.css   # Design system + animations
```

---

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Frontend expects the backend running at the configured URL.

---

## Components

| Component | Purpose |
|-----------|---------|
| `Logo` | Brand mark |
| `Navbar` | Navigation with auth state |
| `Footer` | Site footer |
| `GlassCard` | Glassmorphism card component |
| `RoomCard` | Room preview card for dashboard |
| `CreateRoomModal` | Room creation dialog |
| `CodeEditor` | Code editing area |
| `ChatPanel` | Real-time chat sidebar |
| `ParticipantsList` | Live presence display |
| `ProtectedRoute` | Auth-gated route wrapper |
| `Input` | Styled form input |

All components are fully typed and isolated.
