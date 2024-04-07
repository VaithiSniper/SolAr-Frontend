import type { NextApiRequest, NextApiResponse } from "next";
import notificationapi from "notificationapi-node-server-sdk";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Process a GET request
    notificationapi.init(
      "3tq4pv4bg6olvq0vfh94cpb2lt", // clientId
      "1fjojbkfl4431l4lh4imhtnq6e5tm3qn57mc8572c2e7nh9h35fm" // clientSecret
    );

    notificationapi.send({
      notificationId: "new_comment",
      user: {
        id: "vaithi.genghiskhan@gmail.com",
        email: "vaithi.genghiskhan@gmail.com",
        number: "+919972710382", // Replace with your phone number
      },
      mergeTags: {
        comment: "Build something great :)",
        commentId: "commentId-1234-abcd-wxyz",
      },
    });

    res.json({
      status: 200,
      message: "Notification sent successfully",
    });
  } else {
    res.status(403).send("Not a valid request");
  }
}
