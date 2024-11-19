import Verify from "@/features/auth/components/verify";
import React from "react";

const page = ({ searchParams }: { searchParams: { token: string } }) => {
  const token = searchParams.token;

  return (
    <div>
      {token}
      <Verify token={token} />
    </div>
  );
};

export default page;
