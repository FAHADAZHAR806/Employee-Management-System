import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectToDatabase();
    // Populate allows us to see Department Name instead of just the ID
    const employees = await Employee.find().populate("department", "name");
    return NextResponse.json(employees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Hash password for new employee
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newEmployee = await Employee.create({
      ...body,
      password: hashedPassword,
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
