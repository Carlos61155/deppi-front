"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  try {
    if (token) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000,
        },
      );
    }
  } catch (error) {
    console.error("Não foi possível revogar a sessão na API:", error);
  } finally {
    cookieStore.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  }

  redirect("/login");
}
