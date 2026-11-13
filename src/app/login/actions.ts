"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      email: formData.get("email"),
      password: formData.get("password"),
    },
  );

  const cookieStore = await cookies();
  cookieStore.set("accessToken", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });

  redirect("/dashboard");
}
