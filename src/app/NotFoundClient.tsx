"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { SearchX } from "lucide-react";

export default function NotFoundClient() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Navigation Header */}
      <header className="flex items-center justify-between border-b border-primary/20 px-6 md:px-10 py-4 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
        <Link href="/">
          <Logo size="md" showIcon />
        </Link>
        <div className="flex flex-1 justify-end items-center gap-4">
          <Link
            href="#"
            className="hidden md:flex text-slate-400 font-medium hover:text-primary transition-colors px-3 py-1 text-sm"
          >
            Documentation
          </Link>
          <div className="bg-primary/10 border border-primary/20 rounded-full size-10 flex items-center justify-center overflow-hidden text-xs font-bold">
            AR
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-24 relative">
        {/* Floating code icons */}
        <div className="absolute top-20 left-10 opacity-20 pointer-events-none text-6xl select-none">
          &lt;/&gt;
        </div>
        <div className="absolute bottom-40 right-10 opacity-20 pointer-events-none text-6xl select-none">
          &#123;&#125;
        </div>
        <div className="absolute top-1/2 right-20 opacity-20 pointer-events-none text-4xl select-none">
          &#123;&#125;
        </div>

        {/* Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0" />

        <div className="max-w-2xl w-full flex flex-col items-center text-center relative z-10">
          {/* 404 Visual */}
          <div className="relative mb-8">
            <h1 className="text-primary/5 text-[150px] md:text-[240px] font-black leading-none select-none -translate-x-4 -rotate-2">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <SearchX className="w-16 h-16 md:w-24 md:h-24 text-primary opacity-80" />
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
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="lg"
                className="min-w-[200px] shadow-lg shadow-primary/20"
              >
                Back to Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[200px]"
              ariaLabel="Report an issue"
            >
              Report an Issue
            </Button>
          </div>

          {/* Decorative Element */}
          <div className="mt-16 w-full max-w-lg aspect-video rounded-xl border border-primary/20 bg-primary/5 p-2 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-xl" />
            <div className="w-full h-full rounded-lg overflow-hidden border border-primary/10 flex items-center justify-center bg-background relative">
              <div className="flex flex-col items-center justify-center p-6">
                <SearchX className="w-10 h-10 text-primary/40 mb-2" />
                <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">
                  Target_Not_Found
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-primary/10 bg-background/30">
        <div className="max-w-[960px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-sm">
            © 2024 COLLABCODE. Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Status", "Privacy Policy", "Contact Support"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-slate-400 hover:text-primary transition-colors text-sm"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
