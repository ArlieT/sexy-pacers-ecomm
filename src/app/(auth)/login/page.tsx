import { login } from "@/db/queries/auth";
import { loginSchema } from "@/lib/zod-schema/auth";
import { redirect } from "next/navigation";
import React, { FormEvent } from "react";

const Login = () => {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const email = formData.get("email");
    const password = formData.get("password");

    const validUser = loginSchema.safeParse({ email, password });

    if (validUser.success) {
      const { email, password } = validUser.data;
      const response = await login({ email, password });
      console.log({ response });
    }
  };

  return (
    <form
      action={async (formData) => {
        "use server";
        await handleSubmit(formData);
        redirect("/");
      }}
      className="flex flex-col w-fit border p-2 rounded-sm m-auto"
    >
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
