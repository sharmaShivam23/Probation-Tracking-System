"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { Meteors } from "@/components/magicui/meteors";

export default function UnauthorizedPage() {

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-900 via-black to-red-900 items-center justify-center min-h-screen b px-6">
      <Meteors />
      <Meteors />
      <div className="backdrop-blur-2xl bg-white/10 border border-white/30 text-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <ShieldAlert className="w-16 h-16 text-red-500" />
        </div>


        <h1 className="text-3xl font-bold text-white mb-4">
          Unauthorized Access
        </h1>


        <p className="text-white mb-6">
          You don’t have the necessary permissions to view this page.
          Please go back or login with the correct account.
        </p>

      </div>
    </div>
  );
}
