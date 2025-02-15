// import { NextResponse } from "next/server";
// import { config } from "dotenv";
// import { createAuthenticatedClient } from "@interledger/open-payments";
// import { v4 as uuid } from "uuid";

// config(); // Load environment variables

// const PRIVATE_KEY = process.env.PRIVATE_KEY!;
// const KEY_ID = process.env.KEY_ID!;
// const CENTRAL_WALLET = process.env.CENTRAL_WALLET!;
// const DONOR_WALLET = process.env.DONOR_WALLET!;

// export async function POST(req: Request) {
//   try {
//     const { amount } = await req.json();
//     if (!amount) return NextResponse.json({ error: "Amount is required" }, { status: 400 });

//     // Initialize Open Payments Client for Donor
//     const donorClient = await createAuthenticatedClient({
//       walletAddressUrl: DONOR_WALLET,
//       keyId: KEY_ID,
//       privateKey: PRIVATE_KEY,
//     });

//     // Initialize Open Payments Client for Centralized Wallet
//     const centralClient = await createAuthenticatedClient({
//       walletAddressUrl: CENTRAL_WALLET,
//       keyId: KEY_ID,
//       privateKey: PRIVATE_KEY,
//     });

//     // STEP 1: Create Incoming Payment on the Centralized Wallet
//     const incomingPaymentGrant = await centralClient.grant.request(
//       { url: CENTRAL_WALLET + "/auth" },
//       {
//         access_token: {
//           access: [{ type: "incoming-payment", actions: ["read-all", "create"] }],
//         },
//       }
//     );

//     const incomingPayment = await centralClient.incomingPayment.create(
//       {
//         url: CENTRAL_WALLET,
//         accessToken: incomingPaymentGrant.access_token.value,
//       },
//       {
//         walletAddress: CENTRAL_WALLET,
//         incomingAmount: { assetCode: "USD", assetScale: 2, value: amount },
//         metadata: { description: "Donation to the recovery fund" },
//       }
//     );

//     // STEP 2: Generate a Quote for the Donor
//     const quoteGrant = await donorClient.grant.request(
//       { url: DONOR_WALLET + "/auth" },
//       {
//         access_token: {
//           access: [{ type: "quote", actions: ["create", "read"] }],
//         },
//       }
//     );

//     const quote = await donorClient.quote.create(
//       {
//         url: DONOR_WALLET,
//         accessToken: quoteGrant.access_token.value,
//       },
//       {
//         walletAddress: DONOR_WALLET,
//         receiver: incomingPayment.id,
//         method: "ilp",
//       }
//     );

//     // STEP 3: Create Outgoing Payment Grant (Donor needs to approve)
//     const outgoingPaymentGrant = await donorClient.grant.request(
//       { url: DONOR_WALLET + "/auth" },
//       {
//         access_token: {
//           access: [
//             {
//               type: "outgoing-payment",
//               actions: ["read", "create", "list"],
//               identifier: DONOR_WALLET,
//               limits: {
//                 debitAmount: quote.debitAmount, // Allow up to quoted amount
//                 receiveAmount: quote.receiveAmount,
//               },
//             },
//           ],
//         },
//         interact: {
//           start: ["redirect"],
//           finish: {
//             method: "redirect",
//             uri: "https://your-website.com/complete-payment",
//             nonce: uuid(),
//           },
//         },
//       }
//     );

//     return NextResponse.json({ approvalUrl: outgoingPaymentGrant.interact.redirect, message: "Approve payment in browser" });
//   } catch (error: any) {
//     console.error("Payment error:", error);
//     return NextResponse.json({ error: "Payment failed" }, { status: 500 });
//   }
// }
