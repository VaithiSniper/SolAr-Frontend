import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request

    const { address } = req.body;

    res.json({
      status: 200,
      message: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${address}`,
    });
  }
}
