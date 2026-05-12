import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User"; // Ensure your User model exists

export async function GET() {
  try {
    await connectToDatabase();

    // Sirf Admin aur Managers ko fetch karna behtar hai,
    // ya phir saare users ko agar koi bhi manager ban sakta hai.
    const users = await User.find({}, "name email role").sort({ name: 1 });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error("USERS_FETCH_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
