import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If user is authenticated, redirect to gratitude page
  if (session) {
    redirect("/gratitude");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Three Good Things</h1>
        <p className="text-xl text-gray-600">A simple gratitude journal</p>
        <a
          href="/api/auth/signin/google"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Sign in with Google
        </a>
      </div>
    </main>
  );
}
