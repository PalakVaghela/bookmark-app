"use client";

import { useState } from "react";
import { signOut } from "@/app/(auth)/actions";
import { Bookmark, Copy, Check, LogOut } from "lucide-react";

type DashboardHeaderProps = {
  handle: string;
};

export default function DashboardHeader({ handle }: DashboardHeaderProps) {
  const [copied, setCopied] = useState(false);

  async function copyProfileLink() {
    const profileUrl = `${window.location.origin}/${handle}`;
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <header className="flex items-center justify-between border-b border-gray-800/60 bg-gray-900/20 px-6 py-4 backdrop-blur-md">
      
      {/* Left Side: Brand Logo & User Handler */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600">
            <Bookmark className="h-3.5 w-3.5 text-white" />
          </div>
          <h1 className="text-base font-extrabold tracking-tight text-white sm:text-lg">
            Bookmark
          </h1>
        </div>

        {/* User Handle Meta Display Panel */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-mono font-semibold text-indigo-400">@{handle}</span>
          <span className="text-gray-700">|</span>
          <button
            type="button"
            onClick={copyProfileLink}
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-all active:scale-95 ${
              copied
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700 hover:text-white"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Share Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Side: Log Out Form Action Trigger */}
      <form action={signOut}>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/40 px-4 py-2 text-sm font-semibold text-gray-400 transition-colors hover:border-gray-700 hover:bg-gray-900 hover:text-rose-400 active:scale-95"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </form>
      
    </header>
  );
}
