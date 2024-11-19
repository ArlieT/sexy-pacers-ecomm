import { NextRequest, NextResponse } from "next/server";
export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  console.log("test");

  // Check if the user is authenticated
  const isAuthenticated = await checkUserAuthentication(req);

  const exludedPaths = ["/login", "/signin-signup"];

  if (!isAuthenticated && !exludedPaths.includes(pathname)) {
    // redirect them to the login page if user is not authenticated
    return NextResponse.redirect(`${origin}/signin-signup`);
  }

  return NextResponse.next();
}

export async function checkUserAuthentication(
  req: NextRequest,
): Promise<boolean> {
  const token = req.cookies.get("session");
  return token !== undefined;
}

export const config = {
  matcher: ["/dashboard", "/profile", "/settings", "/api/protected", "/"],
};
