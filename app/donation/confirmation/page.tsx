"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name") || "";
  const email = searchParams.get("email") || "";
  const amount = searchParams.get("amount") || "";
  const donationId = searchParams.get("id") || "";

  const [donationDetails, setDonationDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTrackDonation = async () => {
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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-blue-600 to-purple-700 text-white">
      <h1 className="text-3xl font-bold">Thank You, {name}!</h1>
      <p className="mt-2">
        Your donation of <strong>${amount}</strong> has been successfully processed.
      </p>
      <p className="mt-1 text-sm">
        A confirmation email has been sent to <strong>{email}</strong>.
      </p>
      {donationId && (
        <p className="mt-2 text-sm">
          Donation ID: <strong>{donationId}</strong>
        </p>
      )}

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

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading confirmation details...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
