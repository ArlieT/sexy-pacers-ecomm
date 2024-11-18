import { logout } from "@/db/queries/auth";
import { redirect } from "next/navigation";

const Logout = () => {
  return (
    <button
      onClick={async () => {
        "use server";
        await logout();
        redirect("/signin-signup");
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
