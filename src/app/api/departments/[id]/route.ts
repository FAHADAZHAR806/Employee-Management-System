import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Department from "@/models/Department";
import mongoose from "mongoose";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();

    // NEXT.JS 15+ FIX: Params ko hamesha await karein
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const body = await req.json();
    const { name, code, description, manager } = body;

    // 1. Validation: Kya ID valid MongoDB ID hai?
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid Department ID format" },
        { status: 400 },
      );
    }

    // 2. Update logic
    const updatedDept = await Department.findByIdAndUpdate(
      id,
      {
        name,
        code,
        description,
        manager: manager || null,
      },
      { new: true, runValidators: true },
    );

    // 3. Agar ID valid hai par document nahi mila
    if (!updatedDept) {
      return NextResponse.json(
        { error: "Department not found in database" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedDept, { status: 200 });
  } catch (error: any) {
    console.error("UPDATE_ERROR_LOG:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE function ko bhi update kar dein sath hi
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await Department.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
