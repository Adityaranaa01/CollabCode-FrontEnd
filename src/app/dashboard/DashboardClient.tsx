"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { roomApi, Room, DashboardData } from "@/lib/api";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Sidebar,
  RoomCard,
  Modal,
  Toggle,
  Button,
  ThemeToggle,
} from "@/components";
import { Search, PlusCircle, ChevronDown, LogOut, Loader2, UserPlus, Globe, Atom, FileCode, Braces, Server } from "lucide-react";

const TEMPLATES = [
  {
    label: "HTML Starter",
    lang: "html",
    name: "HTML Project",
    icon: Globe,
    boilerplate: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
  </style>
</head>
<body>
  <h1>Hello World</h1>
  <p>Start building your page here.</p>
</body>
</html>`,
  },
  {
    label: "React Component",
    lang: "javascript",
    name: "React Component",
    icon: Atom,
    boilerplate: `function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>React Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>{" "}
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);`,
  },
  {
    label: "Python Script",
    lang: "python",
    name: "Python Script",
    icon: FileCode,
    boilerplate: `def greet(name: str) -> str:
    return f"Hello, {name}!"

def main():
    names = ["Alice", "Bob", "Charlie"]
    for name in names:
        print(greet(name))

if __name__ == "__main__":
    main()`,
  },
  {
    label: "TypeScript",
    lang: "typescript",
    name: "TypeScript Module",
    icon: Braces,
    boilerplate: `interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(name: string, email: string): User {
  return { id: Date.now(), name, email };
}

const user = createUser("Alice", "alice@example.com");
console.log(user);`,
  },
  {
    label: "REST API",
    lang: "javascript",
    name: "REST API",
    icon: Server,
    boilerplate: `const http = require("http");
const url = require("url");

const items = [];

function handleRequest(req, res) {
  const parsed = url.parse(req.url, true);
  res.setHeader("Content-Type", "application/json");

  if (parsed.pathname === "/api/items" && req.method === "GET") {
    res.end(JSON.stringify(items));
  } else if (parsed.pathname === "/api/items" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => body += chunk);
    req.on("end", () => {
      const item = { id: Date.now(), ...JSON.parse(body) };
      items.push(item);
      res.statusCode = 201;
      res.end(JSON.stringify(item));
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not found" }));
  }
}

const server = http.createServer(handleRequest);
console.log("REST API server created with /api/items endpoint");
console.log("Methods: GET /api/items, POST /api/items");`,
  },
];

const GRADIENTS = [
  "from-primary/20 to-accent/20",
  "from-accent/20 to-primary/20",
  "from-primary/10 to-primary/20",
  "from-accent/10 to-accent/20",
  "from-primary/5 to-accent/10",
  "from-muted to-background",
];

type FilterTab = "All Rooms" | "Owned" | "Joined" | "Public";
const filters: FilterTab[] = ["All Rooms", "Owned", "Joined", "Public"];

function roomGradient(index: number) {
  return GRADIENTS[index % GRADIENTS.length];
}

export default function DashboardPage() {
  const { accessToken, user, logout } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState<FilterTab>("All Rooms");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [roomLanguage, setRoomLanguage] = useState("typescript");
  const [isPrivate, setIsPrivate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const fetchDashboard = useCallback(async () => {
    if (!accessToken) return;

    try {
      setError(null);
      const data = await roomApi.getDashboard(accessToken);
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleCreateRoom() {
    if (!accessToken || !roomName.trim()) return;

    setCreating(true);
    setCreateError(null);
    try {
      const initialContent = selectedTemplate !== null ? TEMPLATES[selectedTemplate].boilerplate : "";
      await roomApi.createRoom(accessToken, {
        name: roomName.trim(),
        language: roomLanguage,
        isPublic: !isPrivate,
        initialContent,
      });
      setIsModalOpen(false);
      setRoomName("");
      setRoomLanguage("typescript");
      setIsPrivate(false);
      setSelectedTemplate(null);
      await fetchDashboard();
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create room",
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleJoinRoom() {
    if (!accessToken || !joinInput.trim()) return;

    setJoining(true);
    setJoinError(null);

    const input = joinInput.trim();

    try {
      let roomId: string;

      if (input.includes("/room/")) {
        const parts = input.split("/room/");
        const segment = parts[parts.length - 1];
        roomId = segment.split("?")[0];

        const urlParams = new URLSearchParams(segment.split("?")[1] || "");
        const inviteToken = urlParams.get("invite");

        if (inviteToken) {
          await roomApi.joinByInvite(accessToken, inviteToken);
          setIsJoinModalOpen(false);
          setJoinInput("");
          router.push(`/room/${roomId}`);
          return;
        }
      } else if (input.length === 64 && /^[a-f0-9]+$/.test(input)) {
        await roomApi.joinByInvite(accessToken, input);
        setIsJoinModalOpen(false);
        setJoinInput("");
        await fetchDashboard();
        return;
      } else {
        roomId = input;
      }

      await roomApi.joinById(accessToken, roomId);
      setIsJoinModalOpen(false);
      setJoinInput("");
      router.push(`/room/${roomId}`);
    } catch (err) {
      setJoinError(
        err instanceof Error ? err.message : "Failed to join room",
      );
    } finally {
      setJoining(false);
    }
  }

  const allRooms: Room[] = dashboard
    ? [...dashboard.ownedRooms, ...dashboard.joinedRooms]
    : [];

  function getFilteredRooms(): Room[] {
    let rooms: Room[] = [];

    switch (activeFilter) {
      case "Owned":
        rooms = dashboard?.ownedRooms ?? [];
        break;
      case "Joined":
        rooms = dashboard?.joinedRooms ?? [];
        break;
      case "Public":
        rooms = dashboard?.publicRooms.rooms ?? [];
        break;
      default:
        rooms = allRooms;
        break;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rooms = rooms.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.language.toLowerCase().includes(q),
      );
    }

    return rooms;
  }

  const filteredRooms = getFilteredRooms();
  const totalRooms = allRooms.length;
  const totalMembers = allRooms.reduce(
    (sum, r) => sum + r._count.memberships,
    0,
  );

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar activeItem="Rooms" onCreateRoom={() => setIsModalOpen(true)} />

        <main className="flex-1 flex flex-col overflow-hidden bg-background relative">
          <header className="h-16 flex items-center justify-between px-8 bg-background/60 backdrop-blur-xl border-b border-border sticky top-0 z-50">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">
                  Workspace
                </span>
                <span className="text-foreground/20">/</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                  Rooms
                </span>
              </div>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-3.5 h-3.5 group-focus-within:text-primary transition-colors" />
                <input
                  className="w-72 pl-10 pr-4 py-2 bg-card border border-border rounded-xl text-xs text-foreground focus:ring-1 focus:ring-primary/40 focus:border-primary/40 outline-none transition-all placeholder:text-foreground/20 shadow-inner"
                  placeholder="Search projects..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-6 relative" ref={menuRef}>
              <ThemeToggle />
              
              <div
                className="group flex items-center gap-0 rounded-full bg-card border border-border hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setShowUserMenu((v) => !v)}
              >
                <span className="max-w-0 group-hover:max-w-[120px] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold text-foreground group-hover:pl-3.5 group-hover:pr-1.5">
                  {user?.displayName?.split(" ")[0]}
                </span>
                <span className="size-8 rounded-full bg-gradient-to-br from-primary to-accent border border-primary/20 flex items-center justify-center text-[10px] font-black text-primary-foreground shadow-lg shrink-0">
                  {initials}
                </span>
              </div>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-5 py-4 border-b border-border bg-background/20">
                    <p className="text-sm font-black text-foreground truncate">
                      {user?.displayName}
                    </p>
                    <p className="text-xs text-foreground/40 truncate mt-0.5 font-medium">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={async () => {
                        setShowUserMenu(false);
                        await logout();
                        router.push("/auth");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="size-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <span className="font-bold">Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
            <div className="max-w-[1400px] mx-auto p-10">
              <div className="flex items-center justify-between mb-16">
                <div className="space-y-2">
                  <h1 className="text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
                    Hi, {user?.displayName?.split(" ")[0] || "there"}
                  </h1>
                  <p className="text-foreground/50 text-sm font-bold flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/60" />
                    Managing{" "}
                    <span className="text-foreground font-black">
                      {totalRooms} projects
                    </span>{" "}
                    with{" "}
                    <span className="text-foreground font-black">
                      {totalMembers} collaborators
                    </span>
                    .
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="font-black tracking-wider uppercase text-[11px] px-8 rounded-2xl"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Start New Room
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="font-black tracking-wider uppercase text-[11px] px-8 rounded-2xl"
                    onClick={() => {
                      setIsJoinModalOpen(true);
                      setJoinError(null);
                      setJoinInput("");
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Join Room
                  </Button>
                </div>
              </div>

              <div className="flex gap-10 border-b border-border mb-10">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`pb-5 text-xs font-black uppercase tracking-[0.15em] transition-all relative cursor-pointer ${
                      activeFilter === filter
                        ? "text-primary"
                        : "text-foreground/40 hover:text-foreground/60"
                    }`}
                  >
                    {filter}
                    {activeFilter === filter && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-lg shadow-primary/60 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {loading && (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}

              {error && !loading && (
                <div className="text-center py-20">
                  <p className="text-red-400 text-sm font-bold">{error}</p>
                  <button
                    onClick={fetchDashboard}
                    className="mt-4 text-xs text-primary font-black uppercase tracking-widest hover:underline cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {!loading && !error && filteredRooms.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-foreground/40 text-sm font-medium">
                    {searchQuery
                      ? "No rooms match your search."
                      : "No rooms yet. Create your first room to get started."}
                  </p>
                </div>
              )}

              {!loading && !error && filteredRooms.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {filteredRooms.length > 0 && (
                    <div className="lg:col-span-8">
                      <RoomCard
                        name={filteredRooms[0].name}
                        language={filteredRooms[0].language}
                        onlineCount={filteredRooms[0]._count.memberships}
                        status={
                          filteredRooms[0]._count.memberships > 1
                            ? "live"
                            : "idle"
                        }
                        gradient={roomGradient(0)}
                        isPrivate={!filteredRooms[0].isPublic}
                        href={`/room/${filteredRooms[0].id}`}
                        className="h-full !p-8"
                      />
                    </div>
                  )}

                  <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                    {filteredRooms.slice(1, 3).map((room, i) => (
                      <RoomCard
                        key={room.id}
                        name={room.name}
                        language={room.language}
                        onlineCount={room._count.memberships}
                        status={room._count.memberships > 1 ? "live" : "idle"}
                        gradient={roomGradient(i + 1)}
                        isPrivate={!room.isPublic}
                        href={`/room/${room.id}`}
                      />
                    ))}
                  </div>

                  <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.slice(3).map((room, i) => (
                      <RoomCard
                        key={room.id}
                        name={room.name}
                        language={room.language}
                        onlineCount={room._count.memberships}
                        status={room._count.memberships > 1 ? "live" : "idle"}
                        gradient={roomGradient(i + 3)}
                        isPrivate={!room.isPublic}
                        href={`/room/${room.id}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCreateError(null);
          }}
          title="Create New Room"
          footer={
            <>
              <Button
                variant="ghost"
                size="md"
                className="text-[11px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary"
                onClick={() => {
                  setIsModalOpen(false);
                  setCreateError(null);
                }}
                ariaLabel="Cancel creating room"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="text-[11px] font-black uppercase tracking-widest"
                ariaLabel="Create room"
                onClick={handleCreateRoom}
                disabled={creating || !roomName.trim()}
              >
                {creating ? "Creating..." : "Create Room"}
              </Button>
            </>
          }
        >
          {createError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-2 mb-4">
              <div className="flex items-center gap-2 text-red-400">
                <PlusCircle className="w-4 h-4 rotate-45" />
                <p className="text-xs font-black uppercase tracking-wider">
                  Plan Limit Reached
                </p>
              </div>
              <p className="text-[13px] text-foreground/80 leading-relaxed font-medium">
                {createError.includes("limit")
                  ? "You've reached the maximum number of rooms for your current plan. Upgrade to create more."
                  : createError}
              </p>
              <a
                href="/plans"
                className="inline-block text-[11px] font-black text-primary hover:underline uppercase tracking-widest mt-1"
              >
                View Plans &rarr;
              </a>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
              Start from Template
            </label>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t, i) => {
                const Icon = t.icon;
                const isSelected = selectedTemplate === i;
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => {
                      setSelectedTemplate(isSelected ? null : i);
                      setRoomName(isSelected ? "" : t.name);
                      setRoomLanguage(isSelected ? "typescript" : t.lang);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-foreground/[0.03] border-border text-foreground/50 hover:bg-foreground/[0.06] hover:text-foreground/70"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
              Room Name
            </label>
            <input
              type="text"
              placeholder="e.g. Frontend Refactor"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full h-11 bg-background/50 border border-border rounded-xl px-4 text-sm text-foreground focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-foreground/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
              Programming Language
            </label>
            <div className="relative">
              <select
                value={roomLanguage}
                onChange={(e) => setRoomLanguage(e.target.value)}
                className="w-full h-11 bg-background/50 border border-border rounded-xl px-4 text-sm text-foreground appearance-none focus:ring-1 focus:ring-primary/50 outline-none transition-all cursor-pointer [&>option]:bg-card [&>option]:text-foreground"
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="cpp">C++</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="ruby">Ruby</option>
                <option value="php">PHP</option>
                <option value="sql">SQL</option>
                <option value="markdown">Markdown</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="shell">Shell</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground/40">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <Toggle
            checked={isPrivate}
            onChange={setIsPrivate}
            label="Private Room"
            description="Only invited members can join"
          />
        </Modal>

        <Modal
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          title="Join a Room"
          footer={
            <>
              <Button
                variant="ghost"
                size="md"
                className="text-[11px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary"
                onClick={() => {
                  setIsJoinModalOpen(false);
                  setJoinError(null);
                }}
                ariaLabel="Cancel joining room"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                className="text-[11px] font-black uppercase tracking-widest"
                ariaLabel="Join room"
                onClick={handleJoinRoom}
                disabled={joining || !joinInput.trim()}
              >
                {joining ? "Joining..." : "Join Room"}
              </Button>
            </>
          }
        >
          {joinError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-red-400">{joinError}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
              Room ID or Invite Link
            </label>
            <input
              type="text"
              placeholder="Paste room ID, invite link, or invite token"
              value={joinInput}
              onChange={(e) => setJoinInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleJoinRoom();
                }
              }}
              className="w-full h-11 bg-background/50 border border-border rounded-xl px-4 text-sm text-foreground focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-foreground/20"
              autoFocus
            />
            <p className="text-[10px] text-foreground/30 font-medium">
              You can paste a full invite link, a standalone invite token, or a room ID to join public rooms directly.
            </p>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
