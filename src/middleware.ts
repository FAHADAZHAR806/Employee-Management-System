import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth-service";

// Define which routes are protected
const protectedRoutes = ["/dashboard", "/employees", "/payroll", "/settings"];
const adminOnlyRoutes = ["/payroll", "/settings"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  // 1. If trying to access protected route without token
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const decoded: any = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // 2. Role-Based Check (RBAC)
    if (adminOnlyRoutes.some((route) => pathname.startsWith(route))) {
      if (decoded.role !== "SUPER_ADMIN" && decoded.role !== "HR_MANAGER") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
