"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token in localStorage or cookies
      localStorage.setItem("token", data.token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-blue-500 to-purple-600 text-white">
      {!showLogin ? (
        // 🏡 Landing Page
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to ZenMode</h1>
          <p className="text-lg max-w-2xl">
            Take control of your digital habits. Protect yourself from distractions, 
            reduce screen time, and live a focused life.
          </p>
          <button
            onClick={() => setShowLogin(true)}
            className="mt-6 bg-white text-blue-600 py-2 px-6 rounded-lg shadow-md hover:bg-gray-200 transition-all"
          >
            Get Started
          </button>
        </div>
      ) : (
        // 🔑 Login Form
        <div className="bg-white dark:bg-gray-900 shadow-lg p-6 rounded-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <button
            onClick={() => setShowLogin(false)}
            className="mt-4 text-sm text-gray-300 hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
