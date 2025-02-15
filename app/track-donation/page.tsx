"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TrackDonationPage() {
  const router = useRouter();
  const [donationId, setDonationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [donationDetails, setDonationDetails] = useState<any>(null);

  const handleTrackDonation = async () => {
    if (!donationId) return alert("Please enter your Donation ID.");
    setLoading(true);

    try {
      const res = await fetch(`/api/donation/trackDonation?id=${donationId}`);
      const data = await res.json();
      setLoading(false);

      if (!res.ok) throw new Error(data.error);
      setDonationDetails(data.donation);
    } catch (err: any) {
      setLoading(false);
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-gray-800 to-black text-white">
      <h1 className="text-3xl font-bold">Track Your Donation</h1>
      <p className="mt-2 text-sm">Enter your Donation ID to check the status.</p>

      <input
        type="text"
        placeholder="Enter Donation ID"
        value={donationId}
        onChange={(e) => setDonationId(e.target.value)}
        className="p-2 border mt-4 border-gray-300 text-black rounded-lg"
      />

      <button
        onClick={handleTrackDonation}
        className="mt-4 bg-yellow-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition-all"
        disabled={loading}
      >
        {loading ? "Tracking..." : "Track My Donation"}
      </button>

      {donationDetails && (
        <div className="mt-4 p-4 bg-white text-black rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Donation Details</h3>
          <p>Name: {donationDetails.name}</p>
          <p>Email: {donationDetails.email}</p>
          <p>Amount: ${donationDetails.amount}</p>
          <p>Date: {new Date(donationDetails.createdAt).toLocaleString()}</p>
        </div>
      )}

      <button
        onClick={() => router.push("/")}
        className="mt-6 bg-white text-blue-600 py-2 px-6 rounded-lg shadow-md hover:bg-gray-200 transition-all"
      >
        Back to Home
      </button>
    </div>
  );
}
