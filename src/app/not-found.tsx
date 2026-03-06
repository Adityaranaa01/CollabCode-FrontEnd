import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Navigation Header */}
      <header className="flex items-center justify-between border-b border-border px-6 md:px-10 py-4 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          <Logo size="md" showIcon={true} />
        </Link>
        <div className="flex flex-1 justify-end items-center gap-4">
          <span className="hidden md:flex text-slate-400 font-medium hover:text-[#895af6] transition-colors px-3 py-1 text-sm cursor-pointer">
            Documentation
          </span>
          <div className="bg-[#895af6]/10 border border-[#895af6]/20 rounded-full size-10 flex items-center justify-center overflow-hidden text-xs font-bold text-white">
            AR
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-24 relative">
        {/* Floating decorations */}
        <div className="absolute top-20 left-10 opacity-20 pointer-events-none text-6xl text-white select-none font-mono">&lt;/&gt;</div>
        <div className="absolute bottom-40 right-10 opacity-20 pointer-events-none text-6xl text-white select-none font-mono">&#123;&#125;</div>

        {/* Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#895af6]/20 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="max-w-2xl w-full flex flex-col items-center text-center relative z-10">
          {/* 404 Visual */}
          <div className="relative mb-8">
            <h1 className="text-[#895af6]/5 text-[150px] md:text-[240px] font-black leading-none select-none -translate-x-4 -rotate-2">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 md:w-24 md:h-24 text-[#895af6] opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M11 8v2" /><path d="M11 14h.01" /></svg>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 max-w-md">
            <h2 className="text-foreground text-3xl md:text-4xl font-bold tracking-tight">
              Looks like you&apos;re lost in the codebase.
            </h2>
            <p className="text-slate-400 text-base md:text-lg">
              The commit you&apos;re looking for doesn&apos;t exist or has been
              merged into oblivion.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              href="/dashboard"
              className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary text-primary-foreground text-base font-bold leading-normal tracking-wide hover:opacity-90 transition-all shadow-lg shadow-primary/20 border border-primary"
            >
              Back to Dashboard
            </Link>
            <button className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 border border-[#895af6]/20 bg-transparent text-slate-200 text-base font-bold leading-normal tracking-wide hover:bg-[#895af6]/10 transition-all">
              Report an Issue
            </button>
          </div>

          {/* Decorative Element */}
          <div className="mt-16 w-full max-w-lg aspect-video rounded-xl border border-primary/20 bg-primary/5 p-2 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-xl" />
            <div className="w-full h-full rounded-lg overflow-hidden border border-primary/10 flex items-center justify-center bg-background relative">
              <div className="flex flex-col items-center justify-center p-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[#895af6]/40 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><line x1="8" x2="14" y1="11" y2="11" /></svg>
                <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">
                  Target_Not_Found
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-border bg-background/30">
        <div className="max-w-[960px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">
            © 2024 COLLABCODE. Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-slate-400 hover:text-[#895af6] transition-colors text-sm cursor-pointer">Status</span>
            <span className="text-slate-400 hover:text-[#895af6] transition-colors text-sm cursor-pointer">Privacy Policy</span>
            <span className="text-slate-400 hover:text-[#895af6] transition-colors text-sm cursor-pointer">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
