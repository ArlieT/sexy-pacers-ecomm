import { prisma } from "@/db/prisma";
import { encrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const tokenInfo = await request.json();

  try {
    const { email } = tokenInfo;

    if (!email) {
      return NextResponse.json(
        { message: "Email not found in token info." },
        { status: 400 },
      );
    }

    const user = prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 400 });
    }

    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
    const session = await encrypt({ user, expires });

    (await cookies()).set("session", session, { expires, httpOnly: true });

    return NextResponse.json(
      { message: "Authenticated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing token info:", error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 400 },
    );
  }
}
