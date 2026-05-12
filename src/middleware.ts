import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret",
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // 1. Static files aur assets ko skip karein (Performance + Loop protection)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. LOGIN PAGE LOGIC
  if (pathname === "/login") {
    if (token) {
      try {
        // Agar pehle se login hai, toh dashboard (root) par bhej dein
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/", req.url));
      } catch (e) {
        // Invalid token hai toh login page load hone dein aur cookie clear karein
        const response = NextResponse.next();
        response.cookies.delete("token");
        return response;
      }
    }
    return NextResponse.next();
  }

  // 3. PROTECTED ROUTES LIST
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
    // Agar user logged in nahi hai
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // 4. ROLE-BASED ACCESS CONTROL (RBAC)
      const adminRoutes = ["/payroll", "/settings"];
      const isAdminRoute = adminRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (isAdminRoute && payload.role !== "admin") {
        // Agar admin nahi hai par admin page access kar raha hai, toh wapas root par bhejo
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Agar sab theek hai, toh page load hone dein (NextResponse.next use karein, redirect nahi)
      return NextResponse.next();
    } catch (error) {
      // Token tampered ya expire hai
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
