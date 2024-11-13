import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      test
    </div>
  );
}
