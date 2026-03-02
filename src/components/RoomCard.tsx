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
  href?: string;
  className?: string;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  name,
  language,
  onlineCount,
  status,
  gradient,
  href = "/room/1",
  className = "",
}) => {
  const isIdle = status === "idle";

  return (
    <Link
      href={href}
      className={`
        group block surface-premium p-6
        surface-premium-hover hover:-translate-y-1 transition-all duration-300
        cursor-pointer relative overflow-hidden rounded-2xl
        ${className}
      `}
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full ${gradient}`} />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1.5">
          <h3
            className={`text-lg font-bold tracking-tight transition-colors duration-300 ${
              isIdle ? "text-slate-400 group-hover:text-slate-200" : "text-slate-100"
            }`}
          >
            {name}
          </h3>
          <div className="flex items-center gap-3">
            <LanguageTag language={language} isActive={!isIdle} />
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {onlineCount} {onlineCount === 1 ? 'Collaborator' : 'Collaborators'}
              </span>
            </div>
          </div>
        </div>
        <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="flex items-center justify-between mt-10 relative z-10">
        <div className="flex -space-x-2.5">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="size-7 rounded-full border-2 border-[#0d0a14] bg-slate-800 flex items-center justify-center text-[9px] font-bold text-slate-300 shadow-xl transition-transform group-hover:translate-x-0.5"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          {onlineCount > 3 && (
            <div className="size-7 rounded-full border-2 border-[#0d0a14] bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold shadow-xl">
              +{onlineCount - 3}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-[10px] font-bold text-primary opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 uppercase tracking-widest">
            Join Space
          </span>
          <div className="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_15px_rgba(137,90,246,0.5)]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
