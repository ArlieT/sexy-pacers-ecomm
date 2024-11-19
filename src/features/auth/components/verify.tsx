"use client";
import { verifyEmail } from "@/features/auth/queries";
import React, { useEffect } from "react";

const Verify = ({ token }: { token: string }) => {
  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        if (response.success === "true") {
          window.location.href = `/login?email=${response.email}`;
        }
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    };

    verify();
  }, [token]);
  return <div>verify</div>;
};

export default Verify;
