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

    // 1. Validate Input
    const validatedData = loginSchema.parse(body);

    // 2. Find User
    const user = await User.findOne({ email: validatedData.email }).select(
      "+password",
    );
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 3. Check Password
    const isMatch = await bcrypt.compare(validatedData.password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 4. Generate Token & Set Cookie
    const token = signToken({
      id: user._id,
      role: user.role,
      email: user.email,
    });

    await setAuthCookie(token);

    // 5. Update last login
    user.lastLogin = new Date();
    await user.save();

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
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
