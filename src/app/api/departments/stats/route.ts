import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Department from "@/models/Department";
import Employee from "@/models/Employee";

export async function GET() {
  try {
    await connectToDatabase();

    // Aggregation pipeline to get employee counts per department
    const stats = await Employee.aggregate([
      {
        $group: {
          _id: "$department",
          employeeCount: { $sum: 1 },
          totalPayroll: { $sum: "$salary" },
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "_id",
          foreignField: "_id",
          as: "deptDetails",
        },
      },
      { $unwind: "$deptDetails" },
    ]);

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
