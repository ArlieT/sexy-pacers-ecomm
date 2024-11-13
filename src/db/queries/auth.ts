"use server";
import bcrypt from "bcrypt";
import { loginSchema, TLogin, TUser, userSchema } from "@/lib/zod-schema/auth";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/session";

// login with email and password
export const login = async ({ email, password }: TLogin) => {
  const validUser = loginSchema.safeParse({ email, password });

  if (!validUser.success) {
    console.error(validUser.error);
    return { error: validUser.error };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: validUser.data.email,
    },
  });

  if (user && (await bcrypt.compare(validUser.data.password, user.password))) {
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
    const session = await encrypt({ user, expires });

    (await cookies()).set("session", session, { expires, httpOnly: true });

    return { success: "true", user };
  } else {
    return { success: "false", message: "no user found" };
  }
};

export const signUp = async (userData: TUser) => {
  try {
    const validUser = userSchema.safeParse({ ...userData });

    if (!validUser.success) {
      console.error(validUser.error);
      return { error: validUser.error };
    }

    const data = {
      ...validUser.data,
      password: await bcrypt.hash(validUser.data.password, 10),
    };

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        mobile: data.mobile,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log({ user });

    if (user) {
      return {
        success: "true",
        message: `${user.firstName} ${user.lastName} has been created`,
      };
    }
    return { success: false };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        console.log("Error: A user with this email already exists.");
        return { error, success: "false", type: "email_exists" };
      }
    }
    return { message: error, success: "false", type: "catch" };
  }
};

export async function logout() {
  // Destroy the session
  (await cookies()).set("session", "", { expires: new Date(0) });
}
