"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function DonationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = decodeURIComponent(searchParams.get("name") || "");
  const email = decodeURIComponent(searchParams.get("email") || "").split(":")[0];
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonation = async () => {
    if (!amount) return alert("Please enter a donation amount");
  
    setLoading(true);
  
    try {
      const res = await fetch("/api/donation/makeDonation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, amount: parseFloat(amount) }),
      });
  
      const data = await res.json();
      setLoading(false);
  
      if (!res.ok) throw new Error(data.error);
  
      // Redirect user to approve the transaction
      // window.open(data.approvalUrl, "_blank");
  
      // After approval, finalize the payment
      router.push(`/donation/confirmation?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&amount=${amount}&id=${data.donationId}`);
    } catch (err: any) {
      setLoading(false);
      alert(err.message);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-green-500 to-blue-600 text-white">
      <h1 className="text-3xl font-bold">Donate to Support Recovery</h1>
      <p className="mt-2">Thank you, {name}, for your generosity!</p>
      <p className="mt-1 text-sm">Your email: {email}</p>

      <input
        type="number"
        placeholder="Enter Amount (USD)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 border mt-4 border-gray-300 text-black rounded-lg"
      />

      <button
        onClick={handleDonation}
        className="mt-4 bg-white text-green-600 py-2 px-6 rounded-lg shadow-md hover:bg-gray-200 transition-all"
        disabled={loading}
      >
        {loading ? "Processing..." : "Donate Now"}
      </button>
    </div>
  );
}
