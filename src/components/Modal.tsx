"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[12px] transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className={`
          w-full max-w-md bg-[#0d0a14]
          border border-white/[0.08] rounded-3xl
          shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl
          transform transition-all duration-300
          animate-in zoom-in-95 fade-in duration-300
          ${className}
        `}
      >
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <h3 className="text-xl font-black text-white tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-white/[0.03] text-slate-500 hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-8 py-6 space-y-6">{children}</div>
        {footer && (
          <div className="px-8 py-6 bg-white/[0.02] flex gap-4 justify-end border-t border-white/[0.04]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
