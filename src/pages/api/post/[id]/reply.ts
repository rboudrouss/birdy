import cookiewrapper from "@/helper/cookiewrapper";
import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import { APIdecorator, prisma } from "@/helper/instances";

const APIPostCreate = APIdecorator(
  replyHandler,
  ["POST"],
  {
    author: Number.isInteger,
    content: (x) => typeof x === "string" && x.length < 256 && x.length > 0,
  },
  { id: isDigit }
);

export default APIPostCreate;

export async function replyHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Post>>
) {
  const { body, query } = req;

  let author = body.author as number;
  let replyTo = parseInt(query.id as string);

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
