import cookiewrapper from "@/helper/cookiewrapper";
import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/helper/instances";
import { idText } from "typescript";

// TODO maybe remove the author id in the request
export default async function postCreate(
  req: NextApiRequest,
  res: NextApiResponse<Post | { error: string }>
) {
  res.setHeader("Allow", ["POST"]);

  const { body, method, query } = req;

  if (method != "POST") {
    res.status(405).json({ error: `Method ${method} Not Allowed` });
    return;
  }

  if (
    !(
      query.id &&
      body.author &&
      body.content &&
      body.content.length < 256 &&
      body.content.length > 0
    )
  ) {
    res
      .status(400)
      .json({ error: "need an author, and a content under 256 characters" });
    return;
  }

  let author = Number(body.author as string);
  let replyTo = Number(query.id);

  if (author < 1 || replyTo < 1) {
    res.status(400).json({ error: "wrong author or id number" });
    return;
  }

  if (!cookiewrapper.checkValidUser(req.cookies, parseInt(body.author))) {
    res.status(403).json({ error: "wrong cookie, wrong account" });
    return;
  }

  let p = await prisma.post.findUnique({
    where: {
      id: parseInt(query.id as string),
    },
  });

  if (!p) {
    res.status(404).json({ error: "Parent post not found" });
    return;
  }

  try {
    p = await prisma.post.create({
      data: {
        content: body.content as string,
        authorId: author,
        replyId: replyTo,
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }

  res.status(201).json(p);
}
