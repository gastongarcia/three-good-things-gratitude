"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Three Good Things
          </h1>
          <p className="mt-2 text-gray-800">Daily gratitude journal</p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/gratitude" })}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Image src="/google.svg" alt="Google logo" width={20} height={20} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
