"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    router.push("/landing");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Welcome to Your Dashboard</h2>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
