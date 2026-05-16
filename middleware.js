import { NextResponse } from "next/server";

function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    return JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

function isExpired(token) {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;

  return payload.exp * 1000 < Date.now();
}

export function middleware(request) {
  const token = request.cookies.get("accessToken")?.value;
  console.log("Middleware token:", token ? `${token}` : "missing");
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (!token || isExpired(token)) {
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const payload = decodeToken(token);

  if (pathname.startsWith("/my-team")) {
    if (payload?.role !== "ADMIN" && payload?.role !== "MANAGER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
