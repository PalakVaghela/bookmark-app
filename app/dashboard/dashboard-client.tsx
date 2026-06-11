"use client";

import { useActionState, useEffect, useMemo, useState, useOptimistic, startTransition } from "react";
import { useRouter } from "next/navigation";
import BookmarkList from "@/components/dashboard/bookmark-list";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import FilterPanel, { type BookmarkFilter } from "@/components/dashboard/filter-panel";
import { createBookmark, deleteBookmark, updateBookmark, type BookmarkState } from "@/app/dashboard/actions";
import type { Bookmark } from "@/types/bookmark";
import { Plus, X, Globe, Link2, Type, Loader2 } from "lucide-react";
import Toast, { type ToastData } from "@/components/providers/toast";

const initialState: BookmarkState = {};

type DashboardClientProps = {
  handle: string;
  bookmarks: Bookmark[];
};

export default function DashboardClient({ handle, bookmarks }: DashboardClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<BookmarkFilter>("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  // 1. OPTIMISTIC UI STATE: Instantly reflects updates for zero-latency UX
  const [optimisticBookmarks, setOptimisticBookmarks] = useOptimistic(
    bookmarks,
    (state, { type, payload }: { type: "create" | "delete" | "update"; payload: any }) => {
      switch (type) {
        case "create":
          return [payload, ...state];
        case "delete":
          return state.filter((b) => b.id !== payload);
        case "update":
          return state.map((b) => (b.id === payload.id ? { ...b, ...payload } : b));
        default:
          return state;
        }
    }
  );

  // 2. INLINE MEMOIZED FILTERING: Keeps the logic grouped cleanly
  const filteredBookmarks = useMemo(() => {
    if (filter === "public") return optimisticBookmarks.filter((b) => b.is_public);
    if (filter === "private") return optimisticBookmarks.filter((b) => !b.is_public);
    return optimisticBookmarks;
  }, [optimisticBookmarks, filter]);

  // 3. SERVER ACTION HOOKS
  const [createState, createAction, isCreating] = useActionState(createBookmark, initialState);
  const [updateState, updateAction, isUpdating] = useActionState(updateBookmark, initialState);
  const [deleteState, deleteAction, isDeleting] = useActionState(deleteBookmark, initialState);

  useEffect(() => {
    if (isCreating) {
      setToast({ type: "loading", message: "Creating bookmark..." });
    }
  }, [isCreating]);

  useEffect(() => {
    if (isUpdating) {
      setToast({ type: "loading", message: "Updating bookmark..." });
    }
  }, [isUpdating]);

  useEffect(() => {
    if (isDeleting) {
      setToast({ type: "loading", message: "Deleting bookmark..." });
    }
  }, [isDeleting]);

  useEffect(() => {
    if (createState.success) {
      setToast({ type: "success", message: "Bookmark created!" });
    } else if (createState.error) {
      setToast({ type: "error", message: createState.error });
    }
  }, [createState.success, createState.error]);

  useEffect(() => {
    if (updateState.success) {
      setToast({ type: "success", message: "Bookmark updated!" });
    } else if (updateState.error) {
      setToast({ type: "error", message: updateState.error });
    }
  }, [updateState.success, updateState.error]);

  useEffect(() => {
    if (deleteState.success) {
      setToast({ type: "success", message: "Bookmark deleted!" });
    } else if (deleteState.error) {
      setToast({ type: "error", message: deleteState.error });
    }
  }, [deleteState.success, deleteState.error]);

  // Consolidated side-effects logic
  useEffect(() => {
    if (createState.success) setShowForm(false);
    if (updateState.success) setEditingId(null);
    if (createState.success || updateState.success || deleteState.success) {
      router.refresh();
    }
  }, [createState.success, updateState.success, deleteState.success, router]);

  useEffect(() => {
    if (filter !== "all") setShowForm(false);
  }, [filter]);

  // Dynamic feedback string builder
  const emptyMessage = useMemo(() => {
    if (bookmarks.length === 0) return "No bookmarks yet.";
    if (filter === "public") return "No public bookmarks.";
    if (filter === "private") return "No private bookmarks.";
    return "No bookmarks yet.";
  }, [bookmarks.length, filter]);

  const handleDelete = (formData: FormData) => {
    const id = String(formData.get("id") ?? "");

    startTransition(() => {
      setOptimisticBookmarks({ type: "delete", payload: id });
      deleteAction(formData);
    });
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#0B0F19] text-white">
      <div className="absolute top-0 right-1/4 -z-10 h-[350px] w-[500px] rounded-full bg-indigo-600/5 blur-[120px]" />
      
      <DashboardHeader handle={handle} />

      <div className="flex flex-1 flex-col md:flex-row gap-6 max-w-full w-full mx-auto px-6 py-6">
      {/* Left Side: Filter Control Component (Increased size slightly to look better on wide screens) */}
      <div className="w-full md:w-64 shrink-0">
        <FilterPanel filter={filter} onFilterChange={setFilter} />
      </div>

        <div className="flex flex-1 flex-col p-4 sm:p-6 rounded-2xl border border-gray-800/60 bg-gray-900/10 backdrop-blur-md">
          {filter === "all" && (
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowForm((open) => !open)}
                className={`group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-md ${
                  showForm
                    ? "bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/10 hover:opacity-95 active:scale-98"
                }`}
              >
                {showForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add Bookmark</>}
              </button>

              {showForm && (
                <form
                  key={createState.success ? "reset" : "active"}
                  action={createAction}
                  className="mt-5 flex w-full max-w-lg flex-col gap-5 rounded-2xl border border-gray-800/90 bg-gray-950/50 p-6 shadow-xl"
                >
                  <div className="border-b border-gray-800 pb-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Save New Link</h3>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Title</label>
                    <div className="relative flex items-center">
                      <Type className="absolute left-3.5 h-4 w-4 text-gray-500" />
                      <input
                        name="title"
                        type="text"
                        required
                        placeholder="e.g., Tailwind CSS Documentation"
                        className="w-full rounded-xl border border-gray-800 bg-gray-900/40 py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide">URL</label>
                    <div className="relative flex items-center">
                      <Link2 className="absolute left-3.5 h-4 w-4 text-gray-500" />
                      <input
                        name="url"
                        type="url"
                        required
                        placeholder="https://tailwindcss.com"
                        className="w-full rounded-xl border border-gray-800 bg-gray-900/40 py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-600 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center mt-1">
                    <label className="relative flex cursor-pointer items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/20 px-4 py-2.5 transition-colors hover:bg-gray-900/40 select-none">
                      <input name="is_public" type="checkbox" className="peer sr-only" />
                      <div className="flex h-5 w-5 items-center justify-center rounded-md border border-gray-700 bg-gray-950 text-transparent transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-500 peer-checked:text-white">
                        <Globe className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium text-gray-300 peer-checked:text-white inline-flex items-center gap-1.5">
                        Make public <span className="text-xs font-normal text-gray-500 font-mono">(Visible on your handle)</span>
                      </span>
                    </label>
                  </div>

                  {createState.error && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs text-rose-400 font-medium">
                      {createState.error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-950 shadow-md transition-all active:scale-98 hover:bg-white disabled:opacity-50"
                  >
                    {isCreating ? <><Loader2 className="h-4 w-4 animate-spin text-gray-950" /> Saving...</> : "Save Bookmark"}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="flex-1 rounded-xl border border-gray-800/40 bg-gray-950/20 p-2 sm:p-4">
            <BookmarkList
              bookmarks={filteredBookmarks}
              emptyMessage={emptyMessage}
              editingId={editingId}
              onEdit={setEditingId}
              onCancelEdit={() => setEditingId(null)}
              updateAction={updateAction}
              deleteAction={handleDelete}
              updateError={updateState.error}
              deleteError={deleteState.error}
            />
          </div>
        </div>
      </div>

      {toast ? <Toast {...toast} onClose={() => setToast(null)} /> : null}
    </div>
  );
}
