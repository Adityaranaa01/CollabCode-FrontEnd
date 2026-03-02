"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Layers, History, Settings, FileText, Plus } from "lucide-react";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}

interface SidebarProps {
  activeItem?: string;
  onCreateRoom?: () => void;
  className?: string;
}

const navItems: SidebarItem[] = [
  { icon: <Layers className="w-[22px] h-[22px]" />, label: "Rooms", href: "/dashboard", active: true },
  { icon: <History className="w-[22px] h-[22px]" />, label: "Recent", href: "#" },
  { icon: <Settings className="w-[22px] h-[22px]" />, label: "Settings", href: "#" },
  { icon: <FileText className="w-[22px] h-[22px]" />, label: "Docs", href: "#" },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeItem = "Rooms",
  onCreateRoom,
  className = "",
}) => {
  return (
    <aside
      className={`w-64 flex-shrink-0 flex flex-col border-r border-white/[0.04] bg-[#050308] z-40 ${className}`}
    >
      <div className="h-16 flex items-center px-6 border-b border-white/[0.04]">
        <Logo size="md" showIcon={true} />
      </div>

      <div className="flex-1 flex flex-col py-6">
        <div className="px-4 mb-4">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.label === activeItem;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? "nav-glow text-primary font-semibold shadow-[0_0_20px_rgba(137,90,246,0.05)]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                    }
                  `}
                >
                  <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300"}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-4 mt-8">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
            Resources
          </p>
          <nav className="space-y-1">
            <Link href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all">
              <History className="w-[20px] h-[20px] text-slate-500 group-hover:text-slate-300" />
              <span className="text-sm">Activity Log</span>
            </Link>
            <Link href="#" className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all">
              <FileText className="w-[20px] h-[20px] text-slate-500 group-hover:text-slate-300" />
              <span className="text-sm">Documentation</span>
            </Link>
          </nav>
        </div>
      </div>

      <div className="p-6 mt-auto border-t border-white/[0.04] bg-[#08060d]/50">
        <Button
          variant="primary"
          fullWidth
          onClick={onCreateRoom}
          className="!shadow-[0_8px_20px_-6px_rgba(137,90,246,0.5)] active:scale-[0.98] transition-transform"
          ariaLabel="Create new project"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">New Project</span>
        </Button>
      </div>
    </aside>
  );
};
