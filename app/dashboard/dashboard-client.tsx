"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBookmark, type BookmarkState } from "@/app/dashboard/actions";
import type { Bookmark } from "@/types/bookmark";

const initialState: BookmarkState = {};

type DashboardClientProps = {
  bookmarks: Bookmark[];
};

export default function DashboardClient({ bookmarks }: DashboardClientProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [state, formAction, isPending] = useActionState(
    createBookmark,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      setShowForm(false);
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="flex flex-1 flex-col p-6">
      <h1 className="mb-4 text-xl font-medium">Dashboard</h1>

      <button
        type="button"
        onClick={() => setShowForm((open) => !open)}
        className="w-fit rounded bg-gray-900 px-4 py-2 text-sm text-white"
      >
        Add
      </button>

      {showForm ? (
        <form
          key={state.success ? "reset" : "active"}
          action={formAction}
          className="mt-4 flex w-full max-w-md flex-col gap-4 rounded border border-gray-300 p-4"
        >
          <label className="flex flex-col gap-1 text-sm">
            Title
            <input
              name="title"
              type="text"
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            URL
            <input
              name="url"
              type="url"
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input name="is_public" type="checkbox" className="h-4 w-4" />
            Public
          </label>

          {state.error ? (
            <p className="text-sm text-red-600">{state.error}</p>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="w-fit rounded bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
        </form>
      ) : null}

      <div className="mt-8 flex w-full max-w-md flex-col gap-3">
        <h2 className="text-lg font-medium">Your bookmarks</h2>

        {bookmarks.length === 0 ? (
          <p className="text-sm text-gray-500">No bookmarks yet.</p>
        ) : (
          bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="rounded border border-gray-300 p-4"
            >
              <p className="font-medium">{bookmark.title}</p>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline"
              >
                {bookmark.url}
              </a>
              <p className="mt-1 text-xs text-gray-500">
                {bookmark.is_public ? "Public" : "Private"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
