import cookiewrapper from "@/helper/cookiewrapper";
import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import { prisma } from "@/helper/instances";

export default async function postCreate(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Post>>
) {
  res.setHeader("Allow", ["POST"]);

  const { body, method, query } = req;

  if (!isDigit(query.id as string)) {
    let code = HttpCodes.BAD_REQ;
    res.status(code).json({
      isError: true,
      status: code,
      message: `id ${query.id} is not a number`,
    });
    return;
  }

  if (method != "POST") {
    let code = HttpCodes.WRONG_METHOD;
    res.status(code).json({
      isError: true,
      status: code,
      message: `Method ${method} Not Allowed`,
    });
    return;
  }

  if (
    !(
      body.author &&
      isDigit(body.author as string) &&
      body.content &&
      body.content.length < 256 &&
      body.content.length > 0
    )
  ) {
    let code = HttpCodes.BAD_REQ;
    res.status(code).json({
      isError: true,
      status: code,
      message: "need an author, and a content under 256 characters",
    });
    return;
  }

  let author = parseInt(body.author as string);
  let replyTo = parseInt(query.id as string);

  if (author < 1 || replyTo < 1) {
    let code = HttpCodes.BAD_REQ;
    res.status(code).json({
      isError: true,
      status: code,
      message: "wrong author or id number",
    });
    return;
  }

  if (!cookiewrapper.back.checkValidUser(req.cookies, author)) {
    let code = HttpCodes.FORBIDDEN;
    res.status(403).json({
      isError: true,
      status: code,
      message: "wrong cookie, wrong account",
    });
    return;
  }

  let p = await prisma.post.findUnique({
    where: {
      id: replyTo,
    },
  });

  if (!p) {
    let code = HttpCodes.NOT_FOUND;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Parent post not found" });
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
    await prisma.post.update({
      where: {
        id: replyTo,
      },
      data: {
        nbReplies: { increment: 1 },
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(500).json({ isError: true, status: code, message: e.message });
    return;
  }

  let code = HttpCodes.CREATED;
  res.status(code).json({
    isError: false,
    status: code,
    message: `User n°${p.authorId} replied to post n°${p.replyId} with post n°${p.id}`,
    data: p,
  });
}
