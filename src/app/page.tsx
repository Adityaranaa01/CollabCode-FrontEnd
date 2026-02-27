"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringEditor, setIsHoveringEditor] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculateTilt = () => {
    if (!isHoveringEditor)
      return { rotateX: -mousePos.y * 0.5, rotateY: mousePos.x * 0.5 };
    return { rotateX: -mousePos.y * 1.5, rotateY: mousePos.x * 1.5 };
  };

  const tilt = calculateTilt();

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden noise">
      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(600px circle at ${50 + mousePos.x * 2}% ${50 + mousePos.y * 2}%, rgba(139, 92, 246, 0.15), transparent 80%)`,
          }}
        />
        <div className="absolute inset-0 glow-gradient" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 px-6 py-8 flex justify-between items-center mix-blend-difference">
        <div className="text-xl font-bold tracking-tighter">
          COLLABCODE<span className="text-brand-purple">.</span>
        </div>
        <div className="flex gap-8 items-center">
          <Link
            href="#"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Documentation
          </Link>
          <Link
            href="/auth"
            className="px-5 py-2 rounded-full glass text-sm font-medium hover:bg-white/10 transition-all"
          >
            Log In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 min-h-screen flex flex-col items-center overflow-hidden">
        <div
          className="max-w-5xl mx-auto text-center z-10 animate-fade-up"
          style={{
            transform: `translate3d(${mousePos.x * -0.8}px, ${mousePos.y * -0.8}px, 0)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          <h1 className="text-7xl md:text-9xl font-bold tracking-tight leading-[0.9] mb-8">
            Code together <br />
            <span className="text-zinc-500">without limits.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-xl mx-auto mb-10">
            The real-time collaborative workspace designed for high-performance
            engineering teams.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth">
              <div
                className="transition-transform duration-200"
                style={{
                  transform: `translate3d(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px, 0)`,
                }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="hover:scale-105 transition-transform"
                >
                  Get Started
                </Button>
              </div>
            </Link>
          </div>
        </div>

        {/* 3D Perspective Editor Mockup */}
        <div
          ref={editorRef}
          onMouseEnter={() => setIsHoveringEditor(true)}
          onMouseLeave={() => setIsHoveringEditor(false)}
          className="perspective-container mt-20 w-full max-w-6xl relative z-20 animate-fade-up"
          style={{
            animationDelay: "0.3s",
            perspective: "2000px",
          }}
        >
          <div
            className="glass rounded-xl shadow-2xl overflow-hidden border border-white/20 transform-gpu transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${10 + tilt.rotateX}deg) rotateY(${-5 + tilt.rotateY}deg) translateZ(0)`,
            }}
          >
            {" "}
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] tracking-widest uppercase text-zinc-500">
                  lib/engine/renderer.ts
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-brand-purple/20 border border-brand-purple/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
                  <span className="text-[10px] text-brand-purple font-bold tracking-wide">
                    LIVE
                  </span>
                </div>
              </div>
            </div>
            {/* Editor Content */}
            <div className="p-8 font-mono text-sm leading-relaxed flex">
              <div className="text-zinc-600 pr-6 text-right select-none">
                1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9<br />
                10
                <br />
                11
              </div>
              <div className="relative w-full">
                <div className="text-zinc-300">
                  <span className="text-purple-400">export const</span>{" "}
                  <span className="text-blue-400">renderLoop</span> = () =&gt;
                  &#123;
                  <br />
                  {"  "}
                  <span className="text-zinc-500">
                    {"// Initialize GPU interface"}
                  </span>
                  <br />
                  {"  "}
                  <span className="text-purple-400">const</span> pipeline ={" "}
                  <span className="text-yellow-200">await</span>{" "}
                  createPipeline();
                  <br />
                  <br />
                  {"  "}
                  <span className="text-purple-400">return</span> &#123;
                  <br />
                  {"    "}draw: (ctx) =&gt; &#123;
                  <br />
                  {"      "}
                  <span className="relative">
                    ctx.clearColor(0, 0, 0, 1);
                    {/* Blue Cursor */}
                    <span className="absolute -top-1 left-0 h-5 w-[2px] bg-blue-500 animate-blink">
                      <span className="absolute -top-5 left-0 px-1.5 py-0.5 bg-blue-500 text-[10px] text-white rounded-sm font-sans whitespace-nowrap">
                        Alex
                      </span>
                    </span>
                  </span>
                  <br />
                  {"      "}pipeline.execute(ctx);
                  <br />
                  {"    "}&#125;
                  <br />
                  {"  "}&#125;
                  <br />
                  &#125;
                </div>

                {/* Purple Cursor */}
                <div className="absolute top-24 left-1/3 h-5 w-[2px] bg-brand-purple animate-blink">
                  <span className="absolute -top-5 left-0 px-1.5 py-0.5 bg-brand-purple text-[10px] text-white rounded-sm font-sans whitespace-nowrap">
                    Sarah
                  </span>
                </div>

                {/* Chat Bubble Overlay */}
                <div className="absolute bottom-0 right-0 glass p-4 rounded-xl max-w-xs shadow-xl border border-white/20 -mr-10 -mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-purple flex-shrink-0 flex items-center justify-center text-xs font-bold">
                      S
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1">Sarah</p>
                      <p className="text-xs text-zinc-400 leading-snug">
                        The pipeline execution seems much faster with the new
                        buffer approach. 🔥
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section className="py-40 px-6 bg-brand-black relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-5xl font-bold tracking-tight mb-8">
              Built for the speed of thought.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              CollabCode synchronizes state changes in under 12ms. It&apos;s not
              just about typing together; it&apos;s about shared context, shared
              terminal sessions, and shared triumph.
            </p>
            <ul className="space-y-4">
              {[
                "CRDT-powered synchronization",
                "Zero-latency local prediction",
                "End-to-end encrypted sessions",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-zinc-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple/20 to-transparent blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
            <div
              className="relative glass rounded-2xl overflow-hidden aspect-square flex items-center justify-center transition-transform duration-500 ease-out"
              style={{
                transform: `perspective(1000px) rotateX(${mousePos.y * 0.1}deg) rotateY(${mousePos.x * -0.1}deg)`,
              }}
            >
              <div className="w-full h-full p-12 bg-[#0a0a0a]/80">
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex items-center gap-4 text-zinc-500 border-b border-white/10 pb-4 mb-8">
                    <span className="text-brand-purple">➜</span>
                    <span>sync_engine_v4.rs</span>
                  </div>
                  <div className="text-zinc-300 opacity-40">
                    impl SyncEngine &#123;
                  </div>
                  <div className="text-zinc-300 pl-4">
                    pub async fn broadcast(&amp;self, op: Operation) &#123;
                  </div>
                  <div className="text-brand-purple pl-8">
                    let latency = self.calculate_delta();
                  </div>
                  <div className="text-zinc-300 pl-8">
                    metrics::record(&quot;sync.delta&quot;, latency);
                  </div>
                  <div className="text-green-400 pl-8 bg-green-400/10 w-fit">
                    self.peers.send(op).await?;
                  </div>
                  <div className="text-zinc-300 pl-4">&#125;</div>
                  <div className="text-zinc-300 opacity-40">&#125;</div>
                </div>
                {/* Floating latency element */}
                <div className="absolute bottom-12 right-12 glass p-4 rounded-lg border-brand-purple/30 border-2">
                  <div className="text-[10px] uppercase tracking-tighter text-zinc-500 mb-1">
                    Latency
                  </div>
                  <div className="text-2xl font-bold font-mono">1.2ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Statement */}
      <section className="py-60 px-6 bg-zinc-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-6xl font-light tracking-tight text-white/90 leading-tight">
            &quot;The most intentional way for <br />
            <span className="font-bold text-white italic">teams</span> to write
            code.&quot;
          </h3>
        </div>
      </section>

      {/* Asymmetrical Feature: Terminal */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
          <div className="md:w-1/3 pt-20">
            <div className="sticky top-40">
              <span className="text-brand-purple text-xs font-bold tracking-[0.2em] uppercase mb-4 block">
                Perspective
              </span>
              <h2 className="text-4xl font-bold mb-6">
                Unified terminal control.
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Stop sharing screens to debug the server. Spin up shared,
                ephemeral terminal sessions where every keystroke is reflected
                for everyone.
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <div
              className="glass h-[600px] rounded-3xl relative overflow-hidden group transition-transform duration-500 ease-out"
              style={{
                transform: `perspective(1000px) rotateX(${mousePos.y * 0.15}deg) rotateY(${mousePos.x * -0.15}deg)`,
              }}
            >
              {/* Terminal Simulation */}
              <div className="absolute inset-0 p-8 font-mono text-sm">
                <div className="text-green-500 mb-2">
                  collabcode@cloud-runtime:~${" "}
                  <span className="text-white">npm run dev</span>
                </div>
                <div className="text-zinc-500">
                  &gt; core-engine@1.0.0 dev
                  <br />
                  &gt; next dev
                  <br />
                  <br />
                  <span className="text-blue-400 italic">ready</span> - started
                  server on 0.0.0.0:3000, url: http://localhost:3000
                  <br />
                  <span className="text-yellow-400 italic">event</span> -
                  compiled client and server successfully in 1245 ms (169
                  modules)
                </div>
              </div>
              {/* Gradient Overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-brand-purple/10 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute bottom-0 right-0 p-12">
                <div className="text-8xl font-black text-white/5 select-none">
                  TERMINAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-xl font-bold tracking-tighter">
            COLLABCODE<span className="text-brand-purple">.</span>
          </div>
          <div className="flex gap-10 text-zinc-500 text-sm">
            {["GitHub", "Twitter", "Discord", "Status"].map((item) => (
              <Link
                key={item}
                href="#"
                className="hover:text-white transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="text-zinc-600 text-xs uppercase tracking-widest">
            © 2024 CollabCode Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
