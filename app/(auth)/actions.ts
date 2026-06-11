"use server";

import { redirect } from "next/navigation";
import { sendSignupSuccessEmail } from "@/lib/emails/signup-success";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
};

export async function signUp(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const handle = String(formData.get("handle") ?? "").trim().toLowerCase();

  let admin;

  try {
    admin = createAdminClient();
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Server configuration error. Check SUPABASE_SERVICE_ROLE_KEY.",
    };
  }

  const { data: existingUser, error: handleCheckError } = await admin
    .from("user")
    .select("handle")
    .eq("handle", handle)
    .maybeSingle();

  if (handleCheckError) {
    return { error: handleCheckError.message };
  }

  if (existingUser) {
    return { error: "This handle is already taken." };
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { handle },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Could not create account. Please try again." };
  }

  const { error: profileError } = await supabase.from("user").insert({
    id: authData.user.id,
    handle,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(authData.user.id);
    return { error: profileError.message };
  }

  await sendSignupSuccessEmail({ to: email, handle });

  if (authData.session) {
    redirect("/dashboard");
  }

  redirect("/login");
}

export async function signIn(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
