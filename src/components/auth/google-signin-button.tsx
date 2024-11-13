"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const SignInButton = () => {
  const router = useRouter();

  useEffect(() => {
    // Handle the credential response from Google Sign-In
    const handleCredentialResponse = async (credentialResponse: any) => {
      console.log("Credential response received:", credentialResponse); // Debugging log

      const response = await fetch("/api/auth/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });

      if (response.ok) {
        console.log("Sign-in successful"); // Debugging log
        router.replace("/"); // Redirect after successful sign-in
      } else {
        console.log("Sign-in failed"); // Debugging log
        // TODO: Handle failed sign-in
      }
    };

    // Load the Google Sign-In script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Initialize Google Sign-In
      if (
        window.google &&
        window.google.accounts &&
        window.google.accounts.id
      ) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        // Render the Google Sign-In button
        window.google.accounts.id.renderButton(
          document.getElementById("g-id-signin"),
          { theme: "outline", size: "large" }
        );
      } else {
        console.error("Google Sign-In API failed to load.");
      }
    };

    // Append the script to the body
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Clean up when the component unmounts
    };
  }, [router]);

  return (
    <div>
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        data-context="signin"
        data-ux_mode="popup"
      ></div>

      <div
        id="g-id-signin" // Make sure this ID matches the one in the renderButton call
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="filled_black"
        data-text="signin_with"
        data-size="large"
        data-logo_alignment="left"
      ></div>
    </div>
  );
};

export default SignInButton;
