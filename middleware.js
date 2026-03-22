import { NextResponse } from "next/server";

export function middleware(request) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  if (!accessToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin));
  }

  // if (accessToken && isAuthPage) {
  //   return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
