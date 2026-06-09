"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/(auth)/actions";

const initialState: AuthState = {};

export default function Login() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <form
        action={formAction}
        className="flex w-full max-w-sm flex-col gap-4 rounded border border-gray-300 p-6"
      >
        <h1 className="text-xl font-medium">Login</h1>

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            name="email"
            type="email"
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>

        {state.error ? (
          <p className="text-sm text-red-600">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {isPending ? "Signing in..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
