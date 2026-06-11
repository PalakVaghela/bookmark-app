"use client";

import { memo } from "react";
import { useFormStatus } from "react-dom";
import type { Bookmark } from "@/types/bookmark";
import { Edit2, Trash2, Globe, Lock, ExternalLink, Save, X, Link2, Type, Loader2 } from "lucide-react";

type BookmarkCardProps = {
  bookmark: Bookmark;
  editingId: string | null;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  updateAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-950 shadow-md transition-all active:scale-95 hover:bg-white disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          Save
        </>
      )}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-400 transition-colors hover:bg-rose-500/20 active:scale-95 disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash2 className="h-4 w-4" />
          Delete
        </>
      )}
    </button>
  );
}

function BookmarkCard({
  bookmark,
  editingId,
  onEdit,
  onCancelEdit,
  updateAction,
  deleteAction,
}: BookmarkCardProps) {
  const isEditing = editingId === bookmark.id;

  // --- STATE A: TEMPORARY INLINE EDIT FORM ---
  if (isEditing) {
    return (
      <form
        action={updateAction}
        className="flex w-full flex-col gap-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 shadow-xl backdrop-blur-md"
      >
        <input type="hidden" name="id" value={bookmark.id} />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">Title</label>
          <div className="relative flex items-center">
            <Type className="absolute left-3.5 h-4 w-4 text-gray-500" />
            <input
              name="title"
              type="text"
              defaultValue={bookmark.title}
              className="w-full rounded-xl border border-gray-800 bg-gray-950/60 py-2 pl-11 pr-4 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">URL</label>
          <div className="relative flex items-center">
            <Link2 className="absolute left-3.5 h-4 w-4 text-gray-500" />
            <input
              name="url"
              type="url"
              defaultValue={bookmark.url}
              className="w-full rounded-xl border border-gray-800 bg-gray-950/60 py-2 pl-11 pr-4 text-sm text-white font-mono focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center mt-1">
          <label className="relative flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-800 bg-gray-900/40 px-3 py-1.5 select-none">
            <input
              name="is_public"
              type="checkbox"
              defaultChecked={bookmark.is_public}
              className="peer sr-only"
            />
            <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-700 bg-gray-950 text-transparent transition-all peer-checked:border-indigo-500 peer-checked:bg-indigo-500 peer-checked:text-white">
              <Globe className="h-2.5 w-2.5" />
            </div>
            <span className="text-xs font-medium text-gray-300 peer-checked:text-white inline-flex items-center gap-1">
              Public Link
            </span>
          </label>
        </div>

        <div className="mt-2 flex gap-2">
          <SaveButton />
          <button
            type="button"
            onClick={onCancelEdit}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/50 px-4 py-2 text-sm font-semibold text-gray-300 transition-colors hover:bg-gray-900 hover:border-gray-700 active:scale-95"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
      </form>
    );
  }

  // --- STATE B: DEFAULT READ-ONLY INTERFACE ---
  return (
    <div className="group relative flex w-full flex-col justify-between rounded-2xl border border-gray-800/60 bg-gray-900/20 p-5 shadow-md backdrop-blur-sm transition-all hover:border-gray-700/80 hover:bg-gray-900/40">
      
      <div>
        <div className="flex items-start justify-between gap-4">
          <h4 className="font-semibold text-gray-100 tracking-tight text-base sm:text-lg line-clamp-2">
            {bookmark.title}
          </h4>
          
          <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
            bookmark.is_public 
              ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" 
              : "bg-gray-800/80 text-gray-400 border-gray-700/60"
          }`}>
            {bookmark.is_public ? <Globe className="h-2.5 w-2.5" /> : <Lock className="h-2.5 w-2.5" />}
            {bookmark.is_public ? "Public" : "Private"}
          </div>
        </div>

        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-center gap-1 mt-2 text-sm font-mono text-indigo-400 hover:text-indigo-300 hover:underline break-all"
        >
          {bookmark.url}
          <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100" />
        </a>
      </div>

      {/* Action Row - Harsh border-t removed; styled using a dark gradient background block instead */}
      <div className="mt-6 -mx-5 -mb-5 flex items-center gap-2 rounded-b-2xl bg-gray-950/30 px-5 py-3.5">
        <button
          type="button"
          onClick={() => onEdit(bookmark.id)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-800 bg-gray-900/50 px-3.5 py-2 text-xs font-bold text-gray-300 transition-colors hover:bg-gray-900 hover:border-gray-700 active:scale-95"
        >
          <Edit2 className="h-3.5 w-3.5 text-gray-400" />
          Edit
        </button>

        <form action={deleteAction}>
          <input type="hidden" name="id" value={bookmark.id} />
          <DeleteButton />
        </form>
      </div>

    </div>
  );
}

function arePropsEqual(
  prev: BookmarkCardProps,
  next: BookmarkCardProps,
): boolean {
  return (
    prev.editingId === next.editingId &&
    prev.bookmark.id === next.bookmark.id &&
    prev.bookmark.title === next.bookmark.title &&
    prev.bookmark.url === next.bookmark.url &&
    prev.bookmark.is_public === next.bookmark.is_public
  );
}

export default memo(BookmarkCard, arePropsEqual);
