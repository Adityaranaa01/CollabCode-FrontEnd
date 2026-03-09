"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRoomSocket } from "@/hooks/useRoomSocket";
import { roomApi, Room, RoomMember } from "@/lib/api";
import {
  getLanguageInfo,
  getMonacoLanguage,
  getFileExtension,
  supportsPreview,
  loadEditorSettings,
  saveEditorSettings,
  type EditorSettings,
} from "@/lib/languageUtils";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TopBar } from "@/components/TopBar";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { ParticipantAvatar } from "@/components/ParticipantAvatar";
import { ChatMessage } from "@/components/ChatMessage";
import { EditorSettingsPopover } from "@/components/EditorSettings";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as monacoEditor } from "monaco-editor";
import {
  FileText,
  GitBranch,
  User,
  Send,
  Code2,
  Loader2,
  Check,
  Copy,
  X,
  Clock,
  Trash2,
  LogOut,
  Settings,
  Keyboard,
  Eye,
  EyeOff,
  GripVertical,
} from "lucide-react";

const AVATAR_COLORS = ["teal", "cyan", "emerald", "sky"] as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SidebarIcon({
  icon: Icon,
  active,
  label,
  onClick,
}: {
  icon: React.FC<{ className?: string }>;
  active?: boolean;
  label?: string;
  onClick?: () => void;
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`p-1.5 rounded-lg transition-colors ${
          active
            ? "text-primary bg-primary/10"
            : "text-foreground/30 hover:text-foreground/60 hover:bg-foreground/5 cursor-pointer"
        }`}
      >
        <Icon className="w-5 h-5" />
      </button>
      {label && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-card border border-border rounded text-[10px] text-foreground/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {label}
        </div>
      )}
    </div>
  );
}

export default function RoomClient() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const { accessToken, user } = useAuth();
  const { isDark } = useTheme();

  const {
    document: roomContent,
    version,
    participants,
    messages,
    connectionStatus,
    sendPatch,
    sendMessage,
    sendCursor,
  } = useRoomSocket(roomId);

  const [roomMeta, setRoomMeta] = useState<Room | null>(null);
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>([]);
  const [roomLoading, setRoomLoading] = useState(true);
  const [chatInput, setChatInput] = useState("");

  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [shareExpiry, setShareExpiry] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Editor enhancement state
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [editorSettings, setEditorSettings] = useState<EditorSettings>(loadEditorSettings);
  const [showEditorSettings, setShowEditorSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");
  const [panelWidth, setPanelWidth] = useState(320);
  const isDragging = useRef(false);
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
  const remoteUpdateRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    if (typeof window === "undefined" || !editorRef.current) return;

    const content = editorRef.current.getValue();
    const ext = getFileExtension(roomMeta?.language || "plaintext");
    const baseName = roomMeta?.name
      ? roomMeta.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()
      : "collabcode-file";
    const fileName = `${baseName}${ext}`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [roomMeta]);

  const handleUpdateEditorSettings = useCallback((newSettings: EditorSettings) => {
    setEditorSettings(newSettings);
    saveEditorSettings(newSettings);
  }, []);

  useEffect(() => {
    if (!accessToken || !roomId) return;

    Promise.all([
      roomApi.getRoom(accessToken, roomId),
      roomApi.getRoomMembers(accessToken, roomId),
    ])
      .then(([room, members]) => {
        setRoomMeta(room);
        setRoomMembers(members);
      })
      .catch(() => {})
      .finally(() => setRoomLoading(false));
  }, [accessToken, roomId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (connectionStatus !== "error") return;
    const timer = setTimeout(() => router.push("/dashboard"), 1500);
    return () => clearTimeout(timer);
  }, [connectionStatus, router]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const model = editor.getModel();
    if (!model) return;

    if (model.getValue() !== roomContent) {
      remoteUpdateRef.current = true;
      const selections = editor.getSelections();
      model.setValue(roomContent);
      if (selections) editor.setSelections(selections);
    }
  }, [roomContent, version]);

  const handleEditorMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      editor.onDidChangeCursorPosition((e) => {
        sendCursor({ line: e.position.lineNumber, ch: e.position.column });
        setCursorPosition({ line: e.position.lineNumber, col: e.position.column });
      });

      // Ctrl+S -> download
      // eslint-disable-next-line no-bitwise
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        handleDownload();
      });
    },
    [sendCursor, handleDownload],
  );

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+Shift+? -> shortcuts modal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "?") {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      }
      // Ctrl+, → editor settings
      if ((e.ctrlKey || e.metaKey) && e.key === ",") {
        e.preventDefault();
        setShowEditorSettings((v) => !v);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleEditorChange(value: string | undefined) {
    if (value === undefined) return;
    if (remoteUpdateRef.current) {
      remoteUpdateRef.current = false;
      return;
    }
    sendPatch(value);

    // Debounced preview update
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    previewTimerRef.current = setTimeout(() => {
      setPreviewContent(value);
    }, 400);
  }

  // Sync preview when roomContent changes (remote edits)
  useEffect(() => {
    setPreviewContent(roomContent);
  }, [roomContent]);

  function handleSendMessage() {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setChatInput("");
  }

  function handleChatKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  async function handleOpenShare() {
    if (!accessToken || !roomId) return;

    setShowShareModal(true);
    setShareLoading(true);
    setShareError(null);
    setShareCopied(false);
    setShareLink(null);

    try {
      const result = await roomApi.createInvite(accessToken, roomId);
      setShareLink(
        `${window.location.origin}/room/${roomId}?invite=${result.token}`,
      );
      setShareExpiry(result.expiresAt);
    } catch {
      setShareError(
        "Failed to generate invite. Only the room owner can create invites.",
      );
    } finally {
      setShareLoading(false);
    }
  }

  async function handleCopyLink() {
    if (!shareLink) return;
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {}
  }

  async function handleLeaveRoom() {
    setActionLoading(true);
    router.push("/dashboard");
  }

  async function handleDeleteRoom() {
    if (!accessToken || !roomId) return;
    setActionLoading(true);
    try {
      await roomApi.deleteRoom(accessToken, roomId);
      router.push("/dashboard");
    } catch {
      setActionLoading(false);
    }
  }

  if (!roomId) return null;

  const topBarParticipants = participants.slice(0, 3).map((p, i) => ({
    initials: getInitials(p.userId),
    color: getAvatarColor(i),
  }));

  if (participants.length > 3) {
    topBarParticipants.push({
      initials: `+${participants.length - 3}`,
      color: "cyan" as const,
    });
  }

  const isConnected = connectionStatus === "connected";
  const isReconnecting = connectionStatus === "reconnecting";
  const isError = connectionStatus === "error";
  const editorLanguage = getMonacoLanguage(roomMeta?.language || "plaintext");
  const langInfo = getLanguageInfo(roomMeta?.language || "plaintext");
  const canPreview = supportsPreview(roomMeta?.language || "plaintext");
  const isOwner = roomMeta?.owner?.id === user?.id;

  return (
    <ProtectedRoute>
      <div className="bg-background font-sans text-foreground overflow-hidden h-screen flex flex-col">
        <TopBar
          roomName={roomMeta?.name || (roomLoading ? "Loading..." : roomId)}
          showLiveBadge={isConnected}
          participants={topBarParticipants}
          onShare={handleOpenShare}
          onDownload={handleDownload}
          onSettings={() => {
            setShowSettingsModal(true);
            setDeleteConfirm(false);
          }}
        />

        {isReconnecting && (
          <div className="h-7 bg-yellow-500/10 border-b border-yellow-500/20 flex items-center justify-center gap-2 text-[11px] text-yellow-500 font-bold uppercase tracking-widest">
            <Loader2 className="w-3 h-3 animate-spin" />
            Reconnecting to room...
          </div>
        )}

        <main className="flex-1 flex overflow-hidden">
          <aside className="w-12 border-r border-border flex flex-col items-center py-4 gap-4 bg-background backdrop-blur-md z-10">
            <SidebarIcon icon={FileText} active label="Files" />
            <SidebarIcon
              icon={Settings}
              label="Settings (Ctrl+,)"
              onClick={() => setShowEditorSettings((v) => !v)}
            />
            <SidebarIcon
              icon={Keyboard}
              label="Shortcuts (Ctrl+Shift+?)"
              onClick={() => setShowShortcuts(true)}
            />
          </aside>

          {/* Editor Area */}
          <section className="flex-1 flex flex-col bg-background/40 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] opacity-50" />
              <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] opacity-30" />
            </div>

            <div className="flex h-10 border-b border-border bg-background/80 backdrop-blur-md">
              <div className="flex items-center px-4 gap-2 bg-card border-t-2 border-primary text-foreground text-xs font-bold cursor-default shadow-inner">
                <Code2 className="w-3.5 h-3.5 text-primary" />
                {roomMeta?.name || "document"}
              </div>
              <div className="flex-1" />
            </div>

            <div className="flex-1 relative">
              {connectionStatus === "connecting" && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/60 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                      Connecting to room...
                    </span>
                  </div>
                </div>
              )}
              {isError && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/60 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm text-red-500 font-black uppercase tracking-widest">
                      Disconnected
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">
                      Redirecting to dashboard...
                    </span>
                  </div>
                </div>
              )}
              <Editor
                height="100%"
                language={editorLanguage}
                theme={isDark ? "vs-dark" : "light"}
                onChange={handleEditorChange}
                onMount={handleEditorMount}
                options={{
                  fontSize: editorSettings.fontSize,
                  lineHeight: Math.round(editorSettings.fontSize * 1.8),
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: editorSettings.minimap },
                  wordWrap: editorSettings.wordWrap ? "on" : "off",
                  lineNumbers: editorSettings.lineNumbers ? "on" : "off",
                  tabSize: editorSettings.tabSize,
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  renderLineHighlight: "gutter",
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  readOnly: !isConnected,
                  bracketPairColorization: { enabled: true },
                  autoClosingBrackets: "always",
                  autoClosingQuotes: "always",
                  formatOnPaste: true,
                  suggestOnTriggerCharacters: true,
                }}
              />
            </div>

            <div className="h-7 border-t border-border bg-card flex items-center px-3 justify-between text-[10px] text-foreground/40 font-medium select-none">
              <div className="flex items-center gap-3">
                {isConnected && (
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 font-bold uppercase tracking-widest">Connected</span>
                  </span>
                )}
                <span className="tabular-nums">Ln {cursorPosition.line}, Col {cursorPosition.col}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-foreground/50 font-bold">{langInfo.displayName}</span>
                <span>Spaces: {editorSettings.tabSize}</span>
                <span>UTF-8</span>
                <span>{participants.length} online</span>
              </div>
            </div>

            <EditorSettingsPopover
              settings={editorSettings}
              onUpdate={handleUpdateEditorSettings}
              isOpen={showEditorSettings}
              onClose={() => setShowEditorSettings(false)}
            />
            <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
          </section>

          {/* Drag-to-resize handle */}
          <div
            className="w-1 hover:w-1.5 bg-transparent hover:bg-primary/30 cursor-col-resize transition-all relative group flex-shrink-0"
            onMouseDown={(e) => {
              e.preventDefault();
              isDragging.current = true;
              const startX = e.clientX;
              const startWidth = panelWidth;
              const handle = e.currentTarget;
              handle.classList.add('bg-primary/40');

              function onMouseMove(ev: MouseEvent) {
                if (!isDragging.current) return;
                const delta = startX - ev.clientX;
                const newWidth = Math.min(600, Math.max(200, startWidth + delta));
                setPanelWidth(newWidth);
              }
              function onMouseUp() {
                isDragging.current = false;
                handle.classList.remove('bg-primary/40');
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
              }
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
              document.body.style.cursor = 'col-resize';
              document.body.style.userSelect = 'none';
            }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 transition-opacity">
              <GripVertical className="w-3 h-3 text-foreground/40" />
            </div>
          </div>

          {/* Right Panel */}
          <aside style={{ width: panelWidth }} className="border-l border-border flex flex-col bg-card backdrop-blur-xl z-10 flex-shrink-0">
            {/* Panel tabs */}
            {canPreview && (
              <div className="flex border-b border-border">
                <button
                  onClick={() => setShowPreview(false)}
                  className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer ${
                    !showPreview
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-foreground/30 hover:text-foreground/50"
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    showPreview
                      ? "text-primary border-b-2 border-primary bg-primary/5"
                      : "text-foreground/30 hover:text-foreground/50"
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
              </div>
            )}

            {/* Preview iframe */}
            {showPreview && canPreview ? (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 bg-white relative">
                  <iframe
                    title="Live Preview"
                    className="w-full h-full border-0"
                    sandbox="allow-scripts allow-modals"
                    srcDoc={previewContent || ""}
                  />
                </div>
              </div>
            ) : (
              <>
            {/* Participants */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                  Active Participants
                </h3>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 uppercase tracking-widest">
                  {participants.length} Total
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {participants.map((p, i) => {
                  const isYou = user?.id === p.userId;
                  const displayName = isYou
                    ? user?.displayName || "You"
                    : `User ${i + 1}`;
                  const initials = isYou
                    ? getInitials(user?.displayName || "You")
                    : `U${i + 1}`;
                  return (
                    <div
                      key={p.userId}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <ParticipantAvatar
                           initials={initials}
                           color={getAvatarColor(i)}
                           status="online"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-foreground">
                            {displayName}
                            {isYou ? " (You)" : ""}
                          </span>
                          <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                            In room
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {participants.length === 0 && (
                  <p className="text-xs font-bold text-foreground/20 uppercase tracking-widest">No participants</p>
                )}
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                  Room Chat
                </h3>
              </div>
              <div className="flex-1 overflow-auto p-4 flex flex-col gap-4 custom-scrollbar">
                {messages.length === 0 && (
                  <p className="text-xs font-bold text-foreground/20 uppercase tracking-widest text-center mt-4">
                    No messages yet
                  </p>
                )}
                {messages.map((msg) => {
                  const isOwn = msg.userId === user?.id;
                  return (
                    <ChatMessage
                      key={msg.id}
                      sender={isOwn ? "You" : msg.user.displayName}
                      time={formatTime(msg.createdAt)}
                      message={msg.content}
                      isOwn={isOwn}
                      color={isOwn ? "default" : "primary"}
                    />
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              <div className="p-4 bg-background">
                <div className="relative">
                  <input
                    className="w-full bg-card border border-border rounded-xl py-2.5 pl-3 pr-10 text-xs font-bold focus:ring-1 focus:ring-primary focus:border-primary outline-none text-foreground placeholder:text-foreground/20 shadow-inner"
                    placeholder="Type a message..."
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyDown}
                  />
                  <button
                    className="absolute right-3 top-2.5 text-primary hover:brightness-110 cursor-pointer transition-all"
                    aria-label="Send message"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
              </>
            )}
          </aside>
        </main>

        <footer className="h-6 bg-primary flex items-center px-3 justify-between text-[10px] text-primary-foreground font-black uppercase tracking-widest select-none shadow-lg shadow-primary/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-1">
              <GitBranch className="w-3 h-3" />
              main
            </div>
            <div className="flex items-center gap-1.5 px-1">
              {participants.length} online
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-1">UTF-8</span>
            <span className="px-1">{langInfo.displayName}</span>
            {canPreview && (
              <button
                onClick={() => setShowPreview((v) => !v)}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                title="Toggle Preview"
              >
                {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                Preview
              </button>
            )}
          </div>
        </footer>
      </div>

      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Room"
        footer={
          <Button
            variant="ghost"
            size="md"
            className="text-[11px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary"
            onClick={() => setShowShareModal(false)}
            ariaLabel="Close share modal"
          >
            Done
          </Button>
        }
      >
        {shareLoading && (
          <div className="flex items-center justify-center py-4 gap-3 text-sm font-bold uppercase tracking-widest text-foreground/40">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            Generating invite...
          </div>
        )}
        {!shareLoading && shareError && (
          <div className="text-sm text-red-500 font-bold uppercase tracking-widest text-center py-4">
            {shareError}
          </div>
        )}
        {!shareLoading && shareLink && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                Room ID
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={roomId}
                  className="flex-1 bg-background/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground outline-none truncate shadow-inner font-mono"
                />
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(roomId);
                    } catch {}
                  }}
                  className="px-4 py-2 rounded-xl bg-foreground/5 text-foreground/60 border border-border hover:bg-foreground/10 transition-all cursor-pointer flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                Invite Link
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={shareLink}
                  className="flex-1 bg-background/50 border border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground outline-none truncate shadow-inner"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-sm"
                >
                  {shareCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            {shareExpiry && (
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/40">
                <Clock className="w-3 h-3" />
                Expires {formatDate(shareExpiry)}
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
          setDeleteConfirm(false);
        }}
        title="Room Settings"
        footer={
          <Button
            variant="ghost"
            size="md"
            className="text-[11px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary"
            onClick={() => {
              setShowSettingsModal(false);
              setDeleteConfirm(false);
            }}
            ariaLabel="Close settings"
          >
            Close
          </Button>
        }
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 border-b border-border pb-2">
              Room Properties
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-foreground/30 block uppercase font-black tracking-widest text-[9px]">Name</span>
                <span className="text-foreground font-black">
                  {roomMeta?.name || "—"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-foreground/30 block uppercase font-black tracking-widest text-[9px]">Language</span>
                <span className="text-primary font-black uppercase">
                  {roomMeta?.language || "—"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-foreground/30 block uppercase font-black tracking-widest text-[9px]">Created</span>
                <span className="text-foreground font-black">
                  {roomMeta?.createdAt ? formatDate(roomMeta.createdAt) : "—"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-foreground/30 block uppercase font-black tracking-widest text-[9px]">Owner</span>
                <span className="text-foreground font-black">
                  {roomMeta?.owner?.displayName || "—"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-foreground/30 block uppercase font-black tracking-widest text-[9px]">Members</span>
                <span className="text-foreground font-black">
                  {roomMembers.length}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-foreground/30 block uppercase font-black tracking-widest text-[9px]">Visibility</span>
                <span className={`font-black uppercase ${roomMeta?.isPublic ? 'text-primary' : 'text-yellow-500'}`}>
                  {roomMeta?.isPublic ? "Public" : "Private"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 border-b border-border pb-2">
              Danger Zone
            </h4>

            {!isOwner && (
              <Button
                variant="ghost"
                size="md"
                className="w-full !justify-start text-foreground hover:text-primary font-black uppercase tracking-widest text-[11px] border border-border hover:bg-primary/5"
                onClick={handleLeaveRoom}
                disabled={actionLoading}
                ariaLabel="Leave room"
              >
                <LogOut className="w-4 h-4" />
                Leave Room
              </Button>
            )}

            {isOwner && !deleteConfirm && (
              <div className="flex flex-col gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full !justify-start text-foreground hover:text-primary font-black uppercase tracking-widest text-[11px] border border-border hover:bg-primary/5"
                  onClick={handleLeaveRoom}
                  disabled={actionLoading}
                  ariaLabel="Leave room"
                >
                  <LogOut className="w-4 h-4" />
                  Leave Room
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  className="w-full !justify-start text-red-500 hover:text-red-300 hover:bg-red-500/10 font-black uppercase tracking-widest text-[11px] border border-red-500/10"
                  onClick={() => setDeleteConfirm(true)}
                  disabled={actionLoading}
                  ariaLabel="Delete room"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Room
                </Button>
              </div>
            )}

            {isOwner && deleteConfirm && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-4">
                <p className="text-[11px] text-red-500 font-bold uppercase tracking-widest leading-relaxed">
                  Permanently delete room and all data. This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] font-black uppercase tracking-widest text-foreground"
                    onClick={() => setDeleteConfirm(false)}
                    ariaLabel="Cancel delete"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="!bg-red-500 !text-white hover:!bg-red-600 !shadow-none text-[10px] font-black uppercase tracking-widest"
                    onClick={handleDeleteRoom}
                    disabled={actionLoading}
                    ariaLabel="Confirm delete room"
                  >
                    {actionLoading ? "Deleting..." : "Delete Forever"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </ProtectedRoute>
  );
}
