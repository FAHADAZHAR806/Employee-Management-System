import { NextResponse } from "next/server";
import Attendance from "@/models/Attendance";
import Leave from "@/models/Leave";
import Employee from "@/models/Employee";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();

    // Aggregating data for all employees
    const employees = await Employee.find({}, "name employeeId designaton");

    const reports = await Promise.all(
      employees.map(async (emp) => {
        // 1. Total Present Days
        const presentDays = await Attendance.countDocuments({
          employee: emp._id,
          checkIn: { $exists: true },
        });

        // 2. Approved Leaves
        const approvedLeaves = await Leave.countDocuments({
          employee: emp._id,
          status: "Approved",
        });

        // 3. Late Arrivals (e.g., check-in after 9:15 AM)
        // Note: This logic assumes 9:00 AM start time
        const attendanceRecords = await Attendance.find({ employee: emp._id });
        const lateDays = attendanceRecords.filter((rec) => {
          if (!rec.checkIn) return false;
          const checkInTime = new Date(rec.checkIn);
          return checkInTime.getHours() >= 9 && checkInTime.getMinutes() > 15;
        }).length;

        return {
          name: emp.name,
          id: emp.employeeId,
          present: presentDays,
          leaves: approvedLeaves,
          late: lateDays,
          score: Math.max(0, 100 - lateDays * 2 - approvedLeaves * 5), // Custom performance score
        };
      }),
    );

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to generate report" },
      { status: 500 },
    );
  }
}
