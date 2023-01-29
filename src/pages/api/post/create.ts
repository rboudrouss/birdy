import { Post, Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../(helper)";

function checkValidCookie(cookies: Partial<{ [key: string]: string }>) {
  // TODO
  return true;
}

// TODO maybe remove the author id in the request
export default async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<Post | { error: string }>
) {
  res.setHeader("Allow", ["POST"]);

  const { body, method } = req;

  if (method != "POST") {
    res.status(405).json({ error: `Method ${method} Not Allowed` });
    return;
  }

  if (
    !(
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

  if (!checkValidCookie(req.cookies)) {
    res.status(403).json({ error: "wrong cookie, wrong account" });
    return;
  }

  let author = Number(body.author as string);

  if (author < 1) {
    res.status(400).json({ error: "wrong author number" });
  }


  let p = await prisma.post.create({
    data: {
      content: body.content as string,
      authorId: author,
    },
  });

  res.status(201).json(p);
}
