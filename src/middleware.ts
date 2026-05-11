import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 1. PUBLIC ROUTES (Login page logic)
  if (pathname === "/login") {
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        // If logged in, redirect away from login to the ROOT (Dashboard)
        return NextResponse.redirect(new URL("/", req.url));
      } catch (e) {
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
    return NextResponse.next();
  }

  // 2. PROTECTED ROUTES
  // Since your dashboard is the ROOT "/", we check for "/" and other sub-routes
  const protectedPaths = [
    "/",
    "/employees",
    "/payroll",
    "/settings",
    "/departments",
  ];
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // Role-Based Check for Admin routes
      const adminRoutes = ["/payroll", "/settings"];
      if (adminRoutes.some((route) => pathname.startsWith(route))) {
        if (payload.role !== "admin") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
