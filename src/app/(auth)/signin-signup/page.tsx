import { redirect } from "next/navigation";
import React from "react";

const page = () => {
  return (
    <div>
      <button
        onClick={async () => {
          "use server";
          redirect("/login");
        }}
      >
        Signin
      </button>
      <button>signup</button>
    </div>
  );
};

export default page;
