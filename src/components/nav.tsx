"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session || pathname === "/login") return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <Link
              href="/gratitude"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/gratitude"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Add Entry
            </Link>
            <Link
              href="/archives"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/archives"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Archives
            </Link>
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
