import { Suspense } from "react";
import { getSession } from "@/lib/session";
import UsersList from "@/features/users/user-list";

export default async function Home() {
  const session = await getSession();
  // serverside fetch with apollo client

  console.log({ session });

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      <Suspense fallback={<p>Loading users...</p>}>
        <UsersList />
      </Suspense>
    </div>
  );
}
