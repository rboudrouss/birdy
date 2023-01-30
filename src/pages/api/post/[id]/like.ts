import cookieWrapper from "@/helper/cookiewrapper";
import { Likes } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../(helper)";

// TODO maybe remove the author id in the request
export default async function likeHandler(
  req: NextApiRequest,
  res: NextApiResponse<Likes | { error: string }>
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

  let p = await prisma.post.findUnique({
    where: {
      id: parseInt(query.id as string),
    },
  });

  if (!p) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  let l = await prisma.likes.create({
    data: {
      postId: parseInt(query.id as string),
      userId: parseInt(body.author),
    },
  });

  res.status(201).json(l);
}
