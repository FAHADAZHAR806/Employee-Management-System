import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Payroll from "@/models/Payroll";
import Employee from "@/models/Employee";

export async function GET() {
  try {
    await connectToDatabase();
    const payrolls = await Payroll.find().populate(
      "employeeId",
      "name employeeId designation",
    );
    return NextResponse.json(payrolls);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { employeeId, month, allowances, deductions } = await req.json();

    const employee = await Employee.findById(employeeId);
    if (!employee)
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );

    const netSalary = employee.salary + (allowances || 0) - (deductions || 0);

    const newPayroll = await Payroll.create({
      employeeId,
      month,
      basicSalary: employee.salary,
      allowances,
      deductions,
      netSalary,
      status: "Pending",
    });

    return NextResponse.json(newPayroll, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
