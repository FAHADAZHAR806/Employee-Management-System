import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Employee from "@/models/Employee";
import Department from "@/models/Department";

export async function GET() {
  try {
    await connectToDatabase();

    // Parallel execution for enterprise performance
    const [employeeCount, departmentCount, payrollData] = await Promise.all([
      Employee.countDocuments({ status: "Active" }),
      Department.countDocuments(),
      Employee.aggregate([
        { $group: { _id: null, totalSalary: { $sum: "$salary" } } },
      ]),
    ]);

    return NextResponse.json(
      {
        totalEmployees: employeeCount,
        totalDepartments: departmentCount,
        monthlyPayroll: payrollData[0]?.totalSalary || 0,
        performanceAvg: 94, // Placeholder for Phase 13
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
