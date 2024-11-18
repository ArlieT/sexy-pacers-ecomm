"use client";
import { signUp } from "@/db/queries/auth";
import { TUser, userSchema } from "@/lib/zod-schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { error } from "console";

type SignUpProps = {
  handleSignUp: (d: TUser) => Promise<void>;
};

const SignUpForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TUser>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (formData: TUser) => {
    setLoading(true);
    try {
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
      };

      const response = await signUp(data);

      if (response.success === "true") {
        setError("root", {
          type: "custom",
          message: response.message,
        });
        localStorage.setItem("user", JSON.stringify(response.email));
        // router.replace("/login");
      } else if (response.type === "email_exists") {
        setError("email", { message: "Email already exists" });
      } else {
        setError("mobile", { message: "Unexpected error" });
      }
    } catch (error) {
      console.log(error);
      setError("root", { type: "custom", message: "Unexpected error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-fit flex-col gap-y-2 rounded-sm border p-2"
    >
      <div>
        <label htmlFor="firstName">First Name</label>
        <input type="text" id="firstName" {...register("firstName")} />
        {errors.firstName && <p>{errors.firstName.message}</p>}
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input type="text" id="lastName" {...register("lastName")} />
        {errors.lastName && <p>{errors.lastName.message}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          {...register("password")}
          className="text-black"
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="mobile">Mobile</label>
        <input type="text" id="mobile" {...register("mobile")} />
        {errors.mobile && <p>{errors.mobile.message}</p>}
      </div>
      <div>
        {errors.root?.type === "custom" && <p>{errors.root.message}</p>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Register"}
      </button>
    </form>
  );
};

export default SignUpForm;
