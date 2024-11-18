"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

const SignInButton = () => {
  const router = useRouter();

  const responseMessage = (response: CredentialResponse) => {
    console.log(response);
  };
  const errorMessage = () => {
    console.log("error");
  };
  return (
    <div>
      <GoogleLogin
        onSuccess={responseMessage}
        onError={errorMessage}
        theme="filled_black"
      />
    </div>
  );
};

export default SignInButton;
