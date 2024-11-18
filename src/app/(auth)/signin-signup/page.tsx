import Button from "@/components/ui/button";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";
import React from "react";

const page = () => {
  return (
    <div className="relative h-full bg-[url('/images/nike-auth-bg.webp')] bg-cover bg-center">
      <div className="to-foreground/95 absolute bottom-0 flex h-[30%] w-full flex-col justify-end gap-4 bg-gradient-to-t from-foreground from-10% via-foreground via-60% to-100% p-4 md:p-6">
        <Image
          src={"/images/sprc-logo.png"}
          width={80}
          height={50}
          alt="nike logo"
        />
        <p className="line-clamp-4 text-justify text-xl text-white">
          Free Shipping, members-only <br />
          products, the best of Nike,
          <br /> personalized for you.
        </p>
        <div className="flex h-fit gap-x-4">
          <Button
            variant={"primary"}
            className=""
            onClick={async () => {
              "use server";
              redirect("/signup", RedirectType.replace);
            }}
          >
            Sign Up
          </Button>
          <Button
            variant={"outline"}
            className=""
            onClick={async () => {
              "use server";
              redirect("/login", RedirectType.replace);
            }}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
