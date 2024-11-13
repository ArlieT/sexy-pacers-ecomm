import { prisma } from "@/db/prisma";
import { encrypt } from "@/lib/session";
import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request, response: Response) {
  const { idToken } = await request.json();

  console.log({ idToken });

  //verify user id
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const userId = payload?.sub;
  if (!payload) {
    return new Response("sign in failed", {
      status: 401,
    });
  }

  let user = await prisma.user.findUnique({ where: { id: userId } });

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
  const session = await encrypt({ user, expires });

  (await cookies()).set("session", session, { expires, httpOnly: true });

  if (!user) {
    // Create a new user if they don't exist, only setting the ID as required
    user = await prisma.user.create({
      data: {
        id: userId!,
        firstName: payload.given_name!, // Optional
        lastName: payload.family_name!, // Optional
        email: payload.email || null, // Optional
      },
    });

    return new Response("sign in success", {
      status: 200,
    });
  } else {
    return new Response("sign in success", {
      status: 200,
    });
  }
}
