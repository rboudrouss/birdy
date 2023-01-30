import cookieWrapper from "@/helper/cookiewrapper";
import { Follows } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/helper/instances";

// TODO maybe remove the author id in the request
export default async function unfollowHandler(
  req: NextApiRequest,
  res: NextApiResponse<{ msg: string } | { error: string }>
) {
  res.setHeader("Allow", ["POST"]);

  const { method, query, body, cookies } = req;

  if (method != "POST") {
    res.status(405).json({ error: `Method ${method} Not Allowed` });
    return;
  }

  if (!body.user) {
    res.status(400).json({ error: "Need the user id" });
    return;
  }

  if (cookieWrapper.checkValidUser(cookies, parseInt(body.author))) {
    res.status(403).json({ error: "Unauthorized, not current connected User" });
    return;
  }

  let u = await prisma.user.findUnique({
    where: {
      id: parseInt(query.id as string),
    },
  });

  if (!u) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  let f = await prisma.follows.delete({
    where: {
      followerId_followingId: {
        followingId: parseInt(query.id as string),
        followerId: parseInt(body.author),
      },
    },
  });

  res.status(201).json({ msg: "Done !" });
}
