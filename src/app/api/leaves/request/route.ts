import { NextResponse } from "next/server";
import Leave from "@/models/Leave";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Simple Validation
    if (!body.employeeId || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newLeave = await Leave.create({
      employee: body.employeeId,
      leaveType: body.leaveType,
      startDate: body.startDate,
      endDate: body.endDate,
      reason: body.reason,
    });

    return NextResponse.json(newLeave, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to submit leave request" },
      { status: 500 },
    );
  }
}
