import { NextResponse } from "next/server";
import Attendance from "@/models/Attendance";
import { connectToDatabase } from "@/lib/mongodb";

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const { employeeId } = await req.json();
    const today = new Date().toISOString().split("T")[0];

    // Find today's attendance record
    const record = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    if (!record) {
      return NextResponse.json(
        { message: "No check-in record found for today" },
        { status: 404 },
      );
    }

    if (record.checkOut) {
      return NextResponse.json(
        { message: "Already checked out for today" },
        { status: 400 },
      );
    }

    // Update checkOut time
    record.checkOut = new Date();
    await record.save();

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Check-out failed" }, { status: 500 });
  }
}
