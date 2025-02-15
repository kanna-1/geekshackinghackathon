"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [step, setStep] = useState<"home" | "roleSelect" | "login" | "donorSignup">("home");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [donorName, setDonorName] = useState("");
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

      // Store token
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
      {step === "home" && (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to ZenMode</h1>
          <p className="text-lg max-w-2xl">
            Take control of your digital habits. Protect yourself from distractions, 
            reduce screen time, and live a focused life.
          </p>
          <button
            onClick={() => setStep("roleSelect")}
            className="mt-6 bg-white text-blue-600 py-2 px-6 rounded-lg shadow-md hover:bg-gray-200 transition-all"
          >
            Get Started
          </button>
        </div>
      )}

      {/* Role Selection Modal */}
      {step === "roleSelect" && (
        <div className="bg-white text-gray-900 shadow-lg p-6 rounded-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-center">Who are you?</h2>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setStep("login")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
            >
              User!
            </button>
            <button
              onClick={() => setStep("donorSignup")}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
            >
              Donor!
            </button>
          </div>
          <button
            onClick={() =>  setStep("home")}
            className="mt-4 text-sm text-gray-500 hover:underline"
          >
            ← Back
          </button>
        </div>
      )}

      {/* Login Form */}
      {step === "login" && (
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
          
          {/* Forgot Password Link */}
          <button
            onClick={() => setStep("forgotPassword")}
            className="mt-4 text-sm text-gray-300 hover:underline"
          >
            Forgot Password?
          </button>

          <button
            onClick={() => setStep("roleSelect")}
            className="mt-4 text-sm text-gray-300 hover:underline"
          >
            ← Back to Selection
          </button>
        </div>
      )}

      {/*Forgot Password Form*/}
      {step === "forgotPassword" && (
        <div className="bg-white dark:bg-gray-900 shadow-lg p-6 rounded-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">Reset Password</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-4">
            Enter your email address and we will send you a password reset link.
          </p>
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
            >
              Send Reset Link
            </button>
          </form>
          <button
            onClick={() => setStep("login")}
            className="mt-4 text-sm text-gray-300 hover:underline"
          >
            ← Back to Login
          </button>
        </div>
      )}

      {/* Donor Signup Form */}
      {step === "donorSignup" && (
        <div className="bg-white text-gray-900 shadow-lg p-6 rounded-lg w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4 text-center">Make A Donation Today!</h2>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
              onClick={() => setStep("donorSignup")}
            >
              Continue
            </button>
          </form>
          <button
            onClick={() => setStep("roleSelect")}
            className="mt-4 text-sm text-gray-500 hover:underline"
          >
            ← Back to Selection
          </button>
        </div>
      )}
    </div>
  );
}
