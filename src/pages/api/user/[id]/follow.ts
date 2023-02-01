import cookieWrapper from "@/helper/cookiewrapper";
import { Follows } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/helper/instances";

// TODO maybe remove the author id in the request
export default async function followHandler(
  req: NextApiRequest,
  res: NextApiResponse<Follows | { error: string }>
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

  try {
    var u = await prisma.user.findUnique({
      where: {
        id: parseInt(query.id as string),
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }

  if (!u) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  try {
    var f = await prisma.follows.create({
      data: {
        followingId: parseInt(query.id as string),
        followerId: parseInt(body.author),
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }

  res.status(201).json(f);
}
