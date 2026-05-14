import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Attendance from "@/models/Attendance";
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    const today = new Date().toISOString().split("T")[0];

    const record = await Attendance.findOne({
      employee: employeeId,
      date: today,
    });

    return NextResponse.json({
      checkedIn: !!record,
      checkedOut: !!record?.checkOut,
      checkIn: record?.checkIn || null,
      checkOut: record?.checkOut || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 },
    );
  }
}
