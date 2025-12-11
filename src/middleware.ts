import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "ml_prep_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Create response to potentially modify
  let response = NextResponse.next();

  // Set session cookie for anonymous user tracking on questions and resume-ready pages
  if (
    pathname.startsWith("/questions") ||
    pathname.startsWith("/api/questions") ||
    pathname.startsWith("/resume-ready") ||
    pathname.startsWith("/api/resume-ready")
  ) {
    const existingSession = request.cookies.get(SESSION_COOKIE_NAME);

    if (!existingSession?.value) {
      const newSessionId = crypto.randomUUID();
      response.cookies.set(SESSION_COOKIE_NAME, newSessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
      });
    }
  }

  // Protect admin routes (except login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const session = request.cookies.get("admin_session");

    if (!session || session.value !== "authenticated") {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/questions/:path*",
    "/api/questions/:path*",
    "/resume-ready/:path*",
    "/api/resume-ready/:path*",
  ],
};
