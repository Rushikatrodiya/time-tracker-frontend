import { NextResponse } from "next/server";

export function middleware(request) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");

  // console.log(accessToken, "accessToken", refreshToken);

  if (!accessToken && !refreshToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // if (accessToken && isAuthPage) {
  //   return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
