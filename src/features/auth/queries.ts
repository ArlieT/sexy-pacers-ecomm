"use server";
import bcrypt from "bcrypt";
import { loginSchema, TLogin, TUser, userSchema } from "@/lib/zod-schema/auth";
import { prisma } from "../../db/prisma";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/session";
import {
  generateUserId,
  generateVerificationToken,
  normalizeEmail,
} from "@/lib/utils";

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const verificationLink = `${process.env.NEXT_PUBLIC_URL}/verify?token=${token}`;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/send-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          subject: "Verify your email",
          verificationLink,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to send verification email");
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error };
  }
};

export const signUp = async (userData: TUser) => {
  try {
    const validUser = userSchema.safeParse({ ...userData });
    if (!validUser.success) {
      console.error(validUser.error);
      return { error: validUser.error, success: "false", type: "invalid_data" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: validUser.data.email },
    });

    if (existingUser) {
      return {
        error: "Email already exists",
        success: "false",
        type: "email_exists",
      };
    }

    const data = {
      ...validUser.data,
      password: await bcrypt.hash(validUser.data.password, 10),
    };

    const userId = generateUserId();
    const verificationToken = generateVerificationToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        id: userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: normalizeEmail(data.email),
        password: data.password,
        mobile: data.mobile,
        verificationToken,
        tokenExpiry,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(
      user.email!,
      verificationToken,
    );

    if (!emailResult.success) {
      // Delete the user if email sending fails
      await prisma.user.delete({ where: { id: userId } }).catch(console.error);
      throw new Error("Failed to send verification email");
    }

    return {
      success: "true",
      email: user.email,
      message: `Please check your email (${user.email}) to verify your account.`,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        return {
          error: "Email already exists",
          success: "false",
          type: "email_exists",
        };
      }
    }
    return {
      message: error instanceof Error ? error.message : "An error occurred",
      success: "false",
      type: "catch",
    };
  }
};


interface GoogleUserInfo {
  email: string;
  // add other fields you might receive from Google
}

export async function googleLogin(tokenInfo: { userInfo: GoogleUserInfo }) {
  try {
    const { userInfo } = tokenInfo;

    if (!userInfo.email) {
      throw new Error("Email not found in token info.");
    }

    const user = await prisma.user.findFirst({
      where: {
        email: normalizeEmail(userInfo.email),
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days
    const session = await encrypt({ user, expires });

    cookies().set("session", session, { expires, httpOnly: true });

    return { success: true };
  } catch (error) {
    console.error("Error processing token info:", error);
    throw error;
  }
}

export const verifyEmail = async (token: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        tokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return {
        success: "false",
        message: "Invalid or expired verification token",
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        tokenExpiry: null,
      },
    });

    return {
      success: "true",
      message: "Email verified successfully",
      email: user.email,
    };
  } catch (error) {
    return { success: "false", message: "Verification failed", error };
  }
};

export async function logout() {
  // Destroy the session
  (await cookies()).set("session", "", { expires: new Date(0) });
}

export const fetchGoogleUser = async (accessToken: string) => {
  try {
    const res = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userInfo = await res.json();
    console.log("Google User Info:", userInfo);
    return { success: "true", userInfo };
  } catch (error) {
    return { success: "false", message: "Error fetching Google user", error };
  }
};

// unused manual login without google
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
