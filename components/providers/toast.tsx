"use client";

import { useEffect } from "react";
import { CheckCircle2, Loader2, X, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "loading";

export type ToastData = {
  message: string;
  type: ToastType;
};

type ToastProps = ToastData & {
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    if (type === "loading") return;

    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [type, onClose]);

  const styles = {
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    error: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    loading: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300",
  };

  const Icon =
    type === "success"
      ? CheckCircle2
      : type === "error"
        ? XCircle
        : Loader2;

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-md ${styles[type]}`}
    >
      <Icon
        className={`h-4 w-4 shrink-0 ${type === "loading" ? "animate-spin" : ""}`}
      />
      <span>{message}</span>
      {type !== "loading" ? (
        <button
          type="button"
          onClick={onClose}
          className="ml-1 opacity-70 hover:opacity-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
