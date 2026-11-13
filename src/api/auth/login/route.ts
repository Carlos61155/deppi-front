import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(req: Request) {
  const body = await req.json();
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    body,
  );

  (await cookies()).set("accessToken", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });

  return NextResponse.json({ ok: true });
}
