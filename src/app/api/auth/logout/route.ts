import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 },
  );

  // Cookie ko delete karne ke liye usse expire kar dein
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // Past date yani foran delete
    path: "/",
  });

  return response;
}
