import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Email validation regex
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function POST(req: Request) {
  try {
    const { name, email, amount } = await req.json();

    const cleanEmail = email.split(":")[0].trim(); // Remove unexpected characters

    if (!name || !cleanEmail || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate email format
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Ensure amount is a valid number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Invalid donation amount" }, { status: 400 });
    }

    // Save the donation in the database
    const donation = await prisma.donation.create({
      data: {
        name,
        email: cleanEmail,
        amount: parsedAmount,
      },
    });

    return NextResponse.json({ message: "Donation recorded!", donationId: donation.id }, { status: 201 });
  } catch (error) {
    console.error("Error in makeDonation API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
