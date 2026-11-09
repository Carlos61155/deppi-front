import "server-only";

import { cookies } from "next/headers";
import type { AuthUser } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token || !API_URL) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Cookie: `accessToken=${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return data as AuthUser;
  } catch {
    return null;
  }
}
