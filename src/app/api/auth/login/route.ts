import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth-service";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const validatedData = loginSchema.parse(body);

    // 1. Find User (Lowercasing email for consistency)
    const user = await User.findOne({
      email: validatedData.email.toLowerCase(),
    }).select("+password");

    // DEBUG: Check if user exists at all
    if (!user) {
      console.log("❌ Login Failed: User not found");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // DEBUG: Check isActive status
    // If your seed script didn't include isActive, this check will fail.
    // Temporarily added '?? true' to ignore if the field is missing.
    if (user.isActive === false) {
      console.log("❌ Login Failed: User is inactive");
      return NextResponse.json(
        { error: "Account is disabled" },
        { status: 401 },
      );
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(validatedData.password, user.password);

    if (!isMatch) {
      console.log("❌ Login Failed: Password mismatch");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 3. Generate Token
    const token = signToken({
      id: user._id,
      role: user.role,
      email: user.email,
    });

    await setAuthCookie(token);

    // 4. Update last login safely
    // Use findOneAndUpdate to avoid triggering "pre-save" password hashing hooks
    await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { lastLogin: new Date() } },
    );

    return NextResponse.json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Critical Auth Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
