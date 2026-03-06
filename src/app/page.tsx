"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Component as Globe } from "@/components/ui/interactive-globe";
import { User, LogOut, Sun, Moon, Zap, Code, Users } from "lucide-react";
import { div } from "framer-motion/client";

// --- Components ---

const AnimatedNumber = ({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const end = value;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = easeProgress * end;
            setDisplayValue(current);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </div>
  );
};

const ThemeToggle = ({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      className="relative w-12 h-6 rounded-full bg-muted border border-border transition-all duration-500 cursor-pointer overflow-hidden z-[110]"
      aria-label="Toggle Theme"
    >
      <div 
        className={`absolute top-1 left-1 size-4 rounded-full transition-all duration-500 flex items-center justify-center pointer-events-none
          ${isDark ? 'translate-x-6 bg-primary text-primary-foreground' : 'translate-x-0 bg-primary text-primary-foreground'}`}
      >
        {isDark ? <Moon size={10} fill="currentColor" /> : <Sun size={10} fill="currentColor" />}
      </div>
    </button>
  );
};

const NavButtons = ({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return <div className="h-10 w-32 bg-primary/5 animate-pulse rounded-full" />;

  return (
    <div className="flex gap-4 md:gap-6 items-center">
      <ThemeToggle isDark={isDark} onToggle={onToggle} />
      
      {isAuthenticated && user ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="group flex items-center gap-0 rounded-full bg-card border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <span className="max-w-0 group-hover:max-w-[120px] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap text-sm font-medium text-foreground group-hover:pl-4 group-hover:pr-2">
              {user.displayName.split(" ")[0]}
            </span>
            <span className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {user.displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-48 bg-popover border border-border rounded-xl shadow-xl overflow-hidden z-[150] animate-in fade-in zoom-in-95 duration-200">
              <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all group">
                <User className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                <span className="font-bold">Profile</span>
              </Link>
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-all group cursor-pointer border-t border-border"
              >
                <LogOut className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                <span className="font-bold">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <Link href="/auth?mode=login" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link href="/auth?mode=signup" className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all shadow-lg">
            Start Free
          </Link>
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ number, title, desc, icon: Icon, children, className = "" }: { number: string; title: string; desc: string; icon: any; children?: React.ReactNode; className?: string }) => (
  <div className={`relative bg-card p-10 rounded-2xl border-t-[3px] border-t-primary/40 border-x border-b border-border group hover:-translate-y-1 transition-all duration-500 ${className}`}>
    <div className="absolute top-4 left-4 text-8xl font-black opacity-[0.06] select-none pointer-events-none text-primary">
      {number}
    </div>
    <div className="relative z-10 flex items-center gap-3 mb-4">
      <Icon className="w-[18px] h-[18px] text-primary" />
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
    </div>
    <p className="relative z-10 text-foreground/70 leading-relaxed mb-6 font-medium">
      {desc}
    </p>
    <div className="h-px w-full bg-border mb-6" />
    <div className="relative z-10">
      {children}
    </div>
    <div className="absolute bottom-2 right-2 size-1 rounded-full bg-primary/20" />
  </div>
);

const StepCard = ({ number, title, desc, rotation }: { number: string; title: string; desc: string; rotation: string }) => (
  <div 
    className={`p-8 bg-background rounded-2xl border border-border transition-all duration-700 hover:rotate-0 hover:z-20 ${rotation}`}
  >
    <div className="inline-block px-3 py-1 rounded-full border border-primary text-[10px] font-mono font-bold text-primary mb-6">
      STEP {number}
    </div>
    <h3 className="text-xl font-bold text-foreground mb-4">{title}</h3>
    <p className="text-foreground/70 text-sm leading-relaxed">{desc}</p>
  </div>
);

const StatCard = ({ label, value, suffix = "", decimals = 0, className = "" }: { label: string; value: number; suffix?: string; decimals?: number; className?: string }) => (
  <div className={`relative p-10 bg-card rounded-2xl overflow-hidden shadow-inner group transition-all duration-500 ${className}`}>
    <div className="text-7xl font-black tracking-tighter text-foreground mb-4">
      <AnimatedNumber value={value} suffix={suffix} decimals={decimals} />
    </div>
    <div className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 mb-6">
      {label}
    </div>
    <div className="flex gap-1.5 h-6 items-end">
      {[40, 70, 50, 90, 60, 80].map((h, i) => (
        <div key={i} className="flex-1 rounded-t-sm bg-primary/20" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

// --- Main Page Component ---

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      if (lineRef.current) {
        const scrollPercent = (window.scrollY - 1800) / 600; 
        const draw = Math.max(0, Math.min(1, scrollPercent));
        lineRef.current.style.strokeDashoffset = `${100 - draw * 100}%`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tickerMessages = [
    "Sarah just joined room 'engine-refactor'",
    "New performance update deployed to production",
    "Marcus created room 'frontend-auth-flow'",
    "Live synchronization latency: 12ms",
    "Active developers worldwide: 1,420",
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/20 transition-colors duration-500 overflow-x-hidden">
      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: hsl(var(--muted)); border-radius: 10px; }
      `}</style>
      
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.4] bg-[radial-gradient(circle_at_2px_2px,rgba(var(--primary),0.05)_1px,transparent_0)] bg-[length:40px_40px]" />

      {/* --- Live Activity Ticker --- */}
      <div className="relative z-[100] h-10 bg-foreground text-background overflow-hidden flex items-center">
        <div className="animate-marquee whitespace-nowrap flex gap-12 px-8">
          {[...tickerMessages, ...tickerMessages].map((msg, i) => (
            <div key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
               <div className="size-1 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
               {msg}
            </div>
          ))}
        </div>
      </div>

      {/* --- Navbar --- */}
      <div className="fixed top-12 left-0 right-0 z-[100] px-6 transition-all duration-300">
        <nav className={`mx-auto max-w-fit flex items-center gap-8 py-2.5 px-6 rounded-full border border-border backdrop-blur-xl transition-all duration-500
          ${scrolled ? 'bg-background/80 shadow-lg scale-95' : 'bg-background/92'}`}>
          <div className="flex items-center gap-2 pr-4 border-r border-border">
            <div className="size-7 bg-primary rounded-md flex items-center justify-center font-black text-primary-foreground text-sm">C</div>
            <span className="text-sm font-black tracking-tighter uppercase whitespace-nowrap text-foreground">CollabCode</span>
          </div>
          <div className="hidden md:flex gap-8 items-center text-xs font-bold uppercase tracking-widest text-foreground/60">
             <a href="#features" className="hover:text-primary transition-colors">Features</a>
             <a href="#how-it-works" className="hover:text-primary transition-colors">Process</a>
             <a href="#stats" className="hover:text-primary transition-colors">Stats</a>
          </div>
          <NavButtons isDark={isDark} onToggle={toggleTheme} />
        </nav>
      </div>

      {/* --- Hero Section --- */}
      <section className="relative z-10 pt-48 pb-32 px-12 min-h-screen flex flex-col items-center overflow-visible">
        <div className="max-w-[1400px] w-full grid lg:grid-cols-2 gap-10 items-center">
          <div className="z-10">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/12 text-[10px] font-bold text-primary uppercase tracking-[0.25em] mb-10">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              Engineered for Speed
            </div>
            <h1 className="text-7xl md:text-[6.5rem] leading-[0.9] tracking-tight mb-12">
              <span className="block font-normal text-foreground">Write code.</span>
              <span className="block italic text-foreground/80">In sync.</span>
              <span className="block font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Everywhere.</span>
            </h1>
            <p className="text-xl text-foreground/70 max-w-lg mb-12 leading-relaxed font-medium">
              The professional real-time collaborative workspace for elite engineering teams. Zero latency, total synchronization.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link href="/auth?mode=signup" className="px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-black text-lg hover:translate-y-[-2px] hover:shadow-xl transition-all">
                Start Coding Free
              </Link>
              <a href="#features" className="px-10 py-5 rounded-2xl bg-transparent border-2 border-primary/20 text-foreground font-bold hover:bg-primary/5 transition-all text-lg">
                View Demo
              </a>
            </div>
          </div>
          <div className="relative flex justify-center perspective-[2000px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-primary/10 blur-[120px] rounded-full" />
            <div className="relative z-10 w-full max-w-[600px]">
              <Globe
                size={600}
                dotColor={isDark ? "rgba(168, 85, 247, ALPHA)" : "rgba(124, 58, 237, ALPHA)"}
                arcColor={isDark ? "rgba(168, 85, 247, 0.4)" : "rgba(124, 58, 237, 0.4)"}
                markerColor={isDark ? "#c084fc" : "#7c3aed"}
                className="opacity-90 transition-all duration-1000"
              />
              {/* <div className="absolute bottom-1/4 -left-20 p-6 bg-card rounded-2xl border border-border shadow-2xl animate-bounce duration-[3s] z-[50]">
                <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Global Latency</div>
                <div className="text-3xl font-black text-primary">12.4ms</div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="relative z-10 py-32 px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-24">
            <h2 className="text-5xl font-black tracking-tight mb-6">Powerful from the <span className="text-primary">ground up.</span></h2>
            <p className="text-foreground/60 font-medium text-lg max-w-md">Engineered for performance, designed for collaboration at scale.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <FeatureCard number="01" title="Real-time Sync" desc="CRDT-based synchronization ensures every keystroke is propagated in under 15ms with zero conflicts." icon={Zap}>
              <div className="flex items-center gap-3"><div className="size-2 rounded-full bg-green-500 animate-pulse" /><span className="text-[10px] font-bold uppercase tracking-widest text-green-600">Low Latency Active</span></div>
            </FeatureCard>
            <FeatureCard number="02" title="Monaco Core" desc="The same engine powering VS Code. Full IntelliSense, syntax highlighting, and multi-language support out of the box." icon={Code} className="md:mt-10">
              <div className="flex gap-2 flex-wrap">{["TypeScript", "Go", "Rust", "Swift"].map(l => (<span key={l} className="text-[10px] font-bold px-2 py-1 rounded bg-primary/5 text-primary border border-primary/10">{l}</span>))}</div>
            </FeatureCard>
            <FeatureCard number="03" title="Team Presence" desc="See who's active, what they're highlighting, and where they're typing in real-time with cursor tracking." icon={Users}>
              <div className="flex -space-x-2">{[1,2,3,4].map(i => (<div key={i} className="size-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-bold text-primary">{String.fromCharCode(64 + i)}</div>))}<div className="size-8 rounded-full border-2 border-card bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">+2</div></div>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section id="how-it-works" className="relative z-10 py-32 bg-card/30">
        <div className="max-w-screen-2xl mx-auto px-12">
          <div className="text-center mb-32">
            <h2 className="text-5xl font-black tracking-tight mb-6">Editorial workflow.</h2>
            <p className="text-foreground/60 font-medium text-lg">Simplified for complex engineering teams.</p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none hidden lg:block overflow-visible">
              <svg width="100%" height="20" className="overflow-visible">
                <path ref={lineRef} d="M 0 10 L 1000 10" stroke="currentColor" className="text-primary transition-all duration-300 opacity-20" strokeWidth="2" fill="none" strokeDasharray="8 8" strokeDashoffset="100" />
              </svg>
            </div>
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-8 relative z-10">
              <StepCard number="01" title="Create a Room" desc="Launch a secure, encrypted workspace in one click. Deploy on our edge or self-host." rotation="-rotate-1" />
              <StepCard number="02" title="Invite Peers" desc="Share a magic link with your team. Zero friction onboarding via instant magic links." rotation="rotate-0" />
              <StepCard number="03" title="Build Together" desc="Ship features faster with shared context and real-time multiplayer code interaction." rotation="rotate-1" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section id="stats" className="relative z-10 py-32 px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            <StatCard label="Active Developers" value={12000} suffix="+" className="lg:col-span-8" />
            <StatCard label="Sync Latency" value={12} suffix="ms" className="lg:col-span-4" />
            <StatCard label="Lines Shipped" value={850} suffix="k" className="lg:col-span-4" />
            <StatCard label="Uptime Reliability" value={99.9} suffix="%" decimals={1} className="lg:col-span-8 p-16" />
          </div>
        </div>
      </section>

      {/* --- CTA Banner --- */}
      <section className="relative z-10 py-32 px-12">
        <div className="max-w-[1400px] mx-auto rounded-3xl bg-foreground text-background p-16 md:p-32 text-center relative overflow-hidden group border border-primary/20">
          <div className="absolute top-0 right-0 size-96 bg-primary/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 size-64 bg-accent/20 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3" />
          <div className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-black text-background tracking-tighter mb-12 leading-[0.9]">Ready to ship<br />faster than ever?</h2>
            <p className="text-background/60 text-xl font-bold mb-16 max-w-xl mx-auto">Join thousands of engineers building the future of software, together.</p>
            <Link href="/auth?mode=signup" className="inline-block px-14 py-6 rounded-2xl bg-primary text-primary-foreground font-black text-xl hover:scale-105 transition-all shadow-2xl">Get Started Free</Link>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="relative z-10 pt-32 pb-16 px-12 border-t border-border">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-4 gap-20 mb-32">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center font-black text-primary-foreground text-xl">C</div>
                <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap text-foreground">CollabCode</span>
              </div>
              <p className="text-foreground/60 font-medium max-w-xs mb-10 leading-relaxed">The high-performance collaborative workspace for engineering teams. Built for speed, security, and scale.</p>
              <div className="text-[10px] font-black text-primary tracking-[0.3em] uppercase">Built for engineers, by engineers.</div>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-10 text-foreground">Product</h4>
              <ul className="space-y-6 text-sm font-bold text-foreground/60">
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">Process</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-10 text-foreground">Legal</h4>
              <ul className="space-y-6 text-sm font-bold text-foreground/60">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><a href="mailto:support@collabcode.io" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border gap-6">
            <div className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">© 2026 CollabCode Inc. Distributed by Human Intelligence.</div>
            <div className="flex gap-10">{["github", "twitter", "linkedin"].map(social => (<a key={social} href="#" className="text-foreground/40 hover:text-primary transition-colors uppercase text-[10px] font-black tracking-widest">{social}</a>))}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
