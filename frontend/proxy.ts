import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

async function checkHasMasterPassword(request: NextRequest): Promise<boolean> {
  const res = await fetch(`${process.env.API_URL}/api/auth/me`, {
    method: "GET",
    // here we get all the cookies from browser request and forward it to express to get permission for /me endpoint
    headers: { cookie: request.headers.get("cookie") ?? "" },
    cache: "no-store",
  });

  if (!res.ok) return false;
  const data = await res.json();
  return data.data.hasMasterPassword;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  //  here we just get jwt token from cookie browser
  const isAuthenticated = !!request.cookies.get("jwt");

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isVaultRoute = pathname.startsWith("/vault");

  // Redirect authenticated users away from auth pages
  if (isAuthPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/vault", request.url));
    }
    return NextResponse.next();
  }

  // Require authentication for all other matched routes
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/setup-master" || isVaultRoute) {
    const hasMaster = await checkHasMasterPassword(request);

    if (pathname === "/setup-master" && hasMaster) {
      return NextResponse.redirect(new URL("/vault", request.url));
    }

    if (isVaultRoute && !hasMaster) {
      return NextResponse.redirect(new URL("/setup-master", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/setup-master", "/vault", "/vault/:path*"],
};
