import SignUpForm from "@/components/signup-form";
import { signUp } from "@/db/queries/auth";
import { TUser } from "@/lib/zod-schema/auth";
import { redirect } from "next/navigation";

const SignUp = async () => {
  return (
    <>
      <SignUpForm />
    </>
  );
};

export default SignUp;
