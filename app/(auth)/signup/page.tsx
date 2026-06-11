"use client";

import { useActionState, useEffect, useState } from "react";
import { signUp, type AuthState } from "@/app/(auth)/actions";
import Link from "next/link";
import { Lock, Mail, AtSign, Loader2, ArrowRight } from "lucide-react";
import Toast, { type ToastData } from "@/components/providers/toast";

const initialState: AuthState = {};

export default function Signup() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    if (isPending) {
      setToast({ type: "loading", message: "Creating account..." });
    }
  }, [isPending]);

  useEffect(() => {
    if (state.error) {
      setToast({ type: "error", message: state.error });
    }
  }, [state.error]);

  return (
    <div className="relative flex min-h-[90vh] flex-1 items-center justify-center p-6 bg-[#0B0F19] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[140px]" />
      <div className="w-full max-w-md rounded-2xl border border-gray-800/90 bg-gray-900/40 p-10 backdrop-blur-xl shadow-2xl">

        <div className="mb-8 text-center sm:text-left">
          <h1 className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            Create your account
          </h1>
          <p className="mt-2 text-base text-gray-300">
            Secure your handle and start hoarding links.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-6">          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 h-5 w-5 text-gray-400" />
              <input
                name="email"
                type="email"
                required
                disabled={isPending}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-800 bg-gray-950/60 py-3 pl-12 pr-4 text-base text-white placeholder-gray-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 h-5 w-5 text-gray-400" />
              <input
                name="password"
                type="password"
                required
                disabled={isPending}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-800 bg-gray-950/60 py-3 pl-12 pr-4 text-base text-white placeholder-gray-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-200">
              Choose Unique Handle
            </label>
            <div className="relative flex items-center">
              <AtSign className="absolute left-4 h-5 w-5 text-indigo-400" />
              <input
                name="handle"
                type="text"
                required
                disabled={isPending}
                placeholder="yourname"
                className="w-full rounded-xl border border-gray-800 bg-gray-950/60 py-3 pl-12 pr-4 text-base text-white placeholder-gray-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <p className="text-xs text-gray-400 mt-1">
              Your public feed lives at <span className="font-mono text-indigo-300 font-semibold">markapp.dev/yourname</span>
            </p>
          </div>

          {state.error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-center text-sm text-rose-400 font-medium">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="group mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 text-base font-bold text-white shadow-lg shadow-indigo-500/10 transition-transform active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Setting up your vault...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already using Bookmark App?{" "}
          <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors">
            Sign In
          </Link>
        </div>

      </div>

      {toast ? <Toast {...toast} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
