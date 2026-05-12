import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Department from "@/models/Department";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, code, description } = await req.json();

    if (!name || !code) {
      return NextResponse.json(
        { error: "Name and Code are required" },
        { status: 400 },
      );
    }

    const newDept = await Department.create({
      name,
      code,
      description,
    });

    return NextResponse.json(newDept, { status: 201 });
  } catch (error: any) {
    console.error("DEPT_ERROR:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Name or Code already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const depts = await Department.find().sort({ createdAt: -1 });
    return NextResponse.json(depts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
