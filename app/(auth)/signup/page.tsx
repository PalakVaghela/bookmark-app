"use client";

import { useState, type SubmitEvent } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handler, setHandler] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded border border-gray-300 p-6"
      >
        <h1 className="text-xl font-medium">Signup</h1>

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Handler
          <input
            type="text"
            value={handler}
            onChange={(e) => setHandler(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="rounded bg-gray-900 px-4 py-2 text-sm text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
