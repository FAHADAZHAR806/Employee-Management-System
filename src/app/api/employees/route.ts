import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import * as z from "zod";

const employeeSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  designation: z.string().min(2),
  salary: z.number().positive(),
  status: z.enum(["Active", "Inactive", "On Leave"]),
  joiningDate: z.string(),
});

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const validatedData = employeeSchema.parse(body);

    const newEmployee = await Employee.create(validatedData);

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const employees = await Employee.find({}).sort({ createdAt: -1 });
    return NextResponse.json(employees);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
