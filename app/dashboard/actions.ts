"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BookmarkState = {
  error?: string;
  success?: boolean;
};

export async function createBookmark(
  _prevState: BookmarkState,
  formData: FormData,
): Promise<BookmarkState> {
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const isPublic = formData.get("is_public") === "on";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("bookmarks").insert({
    user_id: user!.id,
    title,
    url,
    is_public: isPublic,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");

  return { success: true };
}
