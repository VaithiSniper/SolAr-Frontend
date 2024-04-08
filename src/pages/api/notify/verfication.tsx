import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { PublicKey } from "@solana/web3.js";
import type { NextApiRequest, NextApiResponse } from "next";
import notificationapi from "notificationapi-node-server-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const clientId = process.env.NEXT_PUBLIC_NOTIFICATION_API_CLIENT_ID as string;
  const clientSecret = process.env.NEXT_PUBLIC_NOTIFICATION_API_CLIENT_SECRET as string;

  if (req.method === "POST") {
    // Process a POST request
    notificationapi.init(
      clientId, // clientId
      clientSecret // clientSecret
    );

    const receiverId = req.body.userId
    const txnId = req.body.txnId

    try {
      notificationapi.send({
        notificationId: "new_comment",
        user: {
          id: receiverId,
        },
        mergeTags: {
          txnAddress: txnId,
        },
      });

      res.json({
        txnId,
        status: 200,
        message: `Notification sent successfully to ${receiverId}`,
      });
    }
    catch (err: any) {

      res.json({
        txnId,
        status: 401,
        message: "Something went while sending the notification",
      });
    }

  } else {
    res.status(403).send("Not a valid request");
  }
}
