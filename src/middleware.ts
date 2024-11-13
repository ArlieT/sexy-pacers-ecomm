import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  console.log("test");

  // Check if the user is authenticated
  const isAuthenticated = await checkUserAuthentication(req);
  console.log({ isAuthenticated });

  if (!isAuthenticated && pathname !== "/login") {
    // If the user is not authenticated and the current path is not the login page,
    // redirect them to the login page
    return NextResponse.redirect(`${origin}/login`);
  }

  return NextResponse.next();
}

export async function checkUserAuthentication(
  req: NextRequest
): Promise<boolean> {
  const token = req.cookies.get("session");
  return token !== undefined;
}

export const config = {
  matcher: ["/dashboard", "/profile", "/settings", "/api/protected", "/"],
};
