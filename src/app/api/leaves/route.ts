import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Leave from "@/models/Leave";

// Get all leaves (Admin view)
export async function GET() {
  try {
    await connectToDatabase();
    const leaves = await Leave.find().populate("employeeId", "name employeeId");
    return NextResponse.json(leaves);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update Leave Status (Approve/Reject)
export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const { id, status } = await req.json();
    const updatedLeave = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    return NextResponse.json(updatedLeave);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
