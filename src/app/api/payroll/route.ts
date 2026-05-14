import { NextRequest, NextResponse } from "next/server";
import { PayrollService } from "@/lib/services/payrollservice";
import Payroll from "@/models/Payroll";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const query: any = {};
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const data = await Payroll.find(query).populate(
      "employee",
      "name employeeId",
    );
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { month, year } = await req.json();
    const result = await PayrollService.generateMonthlyRun(month, year);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
