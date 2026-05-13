import { NextRequest, NextResponse } from "next/server";
import { EmployeeService } from "@/lib/services/employeesevice";

// Next.js 15 Context Interface
interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH: Update specific employee
 * Next.js 15 dynamic route handler
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    // Params ko await karna Next.js 15 mein mandatory hai
    const { id } = await context.params;
    const body = await req.json();

    const updated = await EmployeeService.update(id, body);

    if (!updated) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("❌ PATCH_ERROR:", error.message);
    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * DELETE: Remove specific employee
 * Next.js 15 dynamic route handler
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    // Params ko await karein
    const { id } = await context.params;

    const deleted = await EmployeeService.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Employee deleted successfully",
        id,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ DELETE_ERROR:", error.message);
    return NextResponse.json(
      { error: "Delete failed", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * GET: Fetch single employee by ID
 */
export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Note: Make sure your service has getById method
    const employee = await EmployeeService.getById(id);

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(employee, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
