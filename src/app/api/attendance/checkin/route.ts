import { NextResponse } from "next/server";
import Attendance from "@/models/Attendance";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { employeeId } = await req.json();
    const today = new Date().toISOString().split("T")[0];

    // Check if already checked in
    const existingRecord = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });
    if (existingRecord) {
      return NextResponse.json(
        { message: "Already checked in for today" },
        { status: 400 },
      );
    }

    const newRecord = await Attendance.create({
      employee: employeeId,
      date: today,
      checkIn: new Date(),
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Check-in failed" }, { status: 500 });
  }
}
