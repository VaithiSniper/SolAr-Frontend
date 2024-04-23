import type { NextApiRequest, NextApiResponse } from "next";
import notificationapi from "notificationapi-node-server-sdk";
import { ADMIN_WALLET_PUBKEY } from "src/constants/admin";

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

    try {
      notificationapi.send({
        notificationId: "new_comment",
        templateId: "request_verification",
        user: {
          id: ADMIN_WALLET_PUBKEY,
        },
      });

      res.json({
        status: 200,
        message: `Notification sent successfully to Admin`,
      });
    }
    catch (err: any) {

      res.json({
        status: 401,
        message: "Something went while sending the notification",
      });
    }

  } else {
    res.status(403).send("Not a valid request");
  }
}
