import { NextResponse } from "next/server";
import Leave from "@/models/Leave";
import { connectToDatabase } from "@/lib/mongodb";

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const { leaveId, status } = await req.json(); // status: 'Approved' or 'Rejected'

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true },
    );

    if (!updatedLeave) {
      return NextResponse.json(
        { message: "Leave record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedLeave, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
