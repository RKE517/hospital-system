"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <div className="bg-green-900 text-white px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">
        
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm">Nandytha Z Putri</span>
        <button
          onClick={() => router.push("/login")}
          className="bg-green-700 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
