import React from "react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { LanguageTag } from "./LanguageTag";

interface RoomCardProps {
  name: string;
  language: string;
  onlineCount: number;
  status: "live" | "idle";
  gradient: string;
  isPrivate?: boolean;
  href?: string;
  className?: string;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  name,
  language,
  onlineCount,
  status,
  gradient,
  isPrivate = false,
  href = "/room/1",
  className = "",
}) => {
  const isIdle = status === "idle";

  return (
    <Link
      href={href}
      className={`
        group block bg-card p-8
        border border-border hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-500
        cursor-pointer relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
        ${className}
      `}
    >
      {/* Dynamic Background Glow */}
      <div
        className={`absolute -right-8 -top-8 w-32 h-32 blur-3xl opacity-10 group-hover:opacity-30 transition-opacity rounded-full ${gradient}`}
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-2">
          <h3
            className={`text-xl font-black tracking-tight transition-colors duration-300 ${
              isIdle
                ? "text-foreground/40 group-hover:text-foreground"
                : "text-foreground"
            }`}
          >
            {name}
          </h3>
          <div className="flex items-center gap-4">
            <LanguageTag
              language={language}
              isActive={!isIdle}
              className="bg-primary/5 border-primary/10 text-primary"
            />
            {isPrivate && (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/10">
                <div className="w-1 h-1 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-[9px] font-black text-yellow-500/80 uppercase tracking-[0.2em]">
                  Private
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <span className="text-[10px] text-foreground/40 font-black uppercase tracking-widest">
                {onlineCount} {onlineCount === 1 ? "Peer" : "Peers"}
              </span>
            </div>
          </div>
        </div>
        <div className="transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 relative z-10">
        <div className="flex -space-x-3 items-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="size-8 rounded-full border-2 border-card bg-background flex items-center justify-center text-[10px] font-black text-primary shadow-xl transition-transform group-hover:translate-x-1 border-primary/10"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          {onlineCount > 3 && (
            <div className="size-8 rounded-full border-2 border-card bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shadow-xl border-primary/20">
              +{onlineCount - 3}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-[10px] font-black text-primary opacity-0 translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 uppercase tracking-[0.2em]">
            Enter Workspace
          </span>
          <div className="size-10 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] group-hover:rotate-[-10deg]">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
