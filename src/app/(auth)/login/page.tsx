"use client";

import React, { FormEvent, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/button";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { fetchGoogleUser } from "@/db/queries/auth";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState<unknown>("");
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      setIsLoading(false);
      //   router.push("/")
      const userInfo = await fetchGoogleUser(response.access_token);
      if (userInfo.success === "false") {
        setIsLoading(false);
        setError(userInfo.error);
        return;
      }
      console.log("Google Login Success:", response);
      const res = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userInfo.email }),
      });
      if (res.ok) {
        router.push("/");
      }
    },
    onError: (error) => {
      setIsLoading(false);
      console.error("Google Login Error:", error);
    },
  });
  const handleLogin = () => {
    setIsLoading(true);
    login();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center outline outline-red-400">
      <div>
        <div className="flex gap-x-4">
          <Image
            src={"/images/nike-logo-black.png"}
            width={80}
            height={50}
            alt="nike logo"
          />
          <Image
            src={"/images/sprc-logo.png"}
            width={80}
            height={50}
            alt="nike logo"
          />
        </div>

        <div className="my-4 w-fit">
          {/* if it detects user */}
          {/* <h1>Would you like to continue as </h1> */}

          {/* if it doesn't detect user */}
          <h1 className="text-2xl">Etner you email to join us or signin.</h1>
        </div>

        <form className="m-auto flex h-auto w-fit flex-col space-y-4 rounded-sm p-2">
          {/* <Input
            type="email"
            name="email"
            placeholder="Email*"
            intent={"outline"}
            required
            className="rounded-md py-3"
          /> */}
          <div className="w-full outline">
            <Button
              variant="outline"
              className="w-full border-gray-300 bg-white text-black hover:bg-gray-100"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                // <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                <>loading</>
              ) : (
                // <Icons.google className="mr-2 h-4 w-4" />
                <>google</>
              )}
              Sign in with Google
            </Button>
          </div>
          <div className="w-[80%] text-gray-400">
            By continuing, I agree to Sprc’s
            <a target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            and
            <a target="_blank" rel="noopener noreferrer">
              Terms of Use
            </a>
            .
          </div>
          <div className="ml-auto w-auto">
            <Button
              variant={"primary"}
              type="submit"
              className="bg-black text-white hover:bg-black/80"
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
