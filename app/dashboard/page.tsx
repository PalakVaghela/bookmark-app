"use client";

import { useState, type SubmitEvent } from "react";

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  function handleCreate(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

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
          onSubmit={handleCreate}
          className="mt-4 flex w-full max-w-md flex-col gap-4 rounded border border-gray-300 p-4"
        >
          <label className="flex flex-col gap-1 text-sm">
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            URL
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="rounded border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4"
            />
            Public
          </label>

          <button
            type="submit"
            className="w-fit rounded bg-gray-900 px-4 py-2 text-sm text-white"
          >
            Create
          </button>
        </form>
      ) : null}
    </div>
  );
}
