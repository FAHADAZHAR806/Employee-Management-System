import { NextResponse } from "next/server";
import { EmployeeService } from "@/lib/services/employeesevice";
import { EmployeeSchema } from "@/lib/validations/employee.schema";

// Next.js 15 optimization: Cache ko bypass karne ke liye
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10;

    console.log(`Fetching employees: page=${page}, search=${search}`);

    // Yahan check karein ke kya getAll method mojood hai
    // Agar Service mein error hai, toh ye catch block mein jaye ga
    const data = await EmployeeService.getAll({
      search,
      page,
      limit,
    });

    // Agar data null ya undefined hai toh empty format bhejein
    if (!data) {
      return NextResponse.json(
        { employees: [], totalPages: 1 },
        { status: 200 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    // Yeh error terminal (VS Code) mein dikhayega ke masla kya hai
    console.error("❌ GET_EMPLOYEES_ERROR:", error.message);

    // Frontend ko crash hone se bachane ke liye empty response
    return NextResponse.json(
      { employees: [], totalPages: 1, error: "Service Error" },
      { status: 200 }, // Status 200 rakha hai taake toast error na aaye
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = EmployeeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 },
      );
    }

    const newEmployee = await EmployeeService.create(validation.data);
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    console.error("❌ POST_ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
