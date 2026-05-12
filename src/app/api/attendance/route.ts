import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { employeeId, status } = await req.json();
    const today = new Date().toISOString().split("T")[0];

    // Check if user already checked in today
    let record = await Attendance.findOne({ employeeId, date: today });

    if (!record) {
      // First check-in of the day
      record = await Attendance.create({
        employeeId,
        date: today,
        checkIn: new Date(),
        status,
      });
    } else {
      // Logic for Check-out
      record.checkOut = new Date();
      await record.save();
    }

    return NextResponse.json(record, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
