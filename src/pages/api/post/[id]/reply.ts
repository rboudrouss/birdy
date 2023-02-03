import cookiewrapper from "@/helper/cookiewrapper";
import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, } from "@/helper/constants";
import { prisma } from "@/helper/instances";

// TODO maybe remove the author id in the request
export default async function postCreate(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Post>>
) {
  res.setHeader("Allow", ["POST"]);

  const { body, method, query } = req;

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
      query.id &&
      body.author &&
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

  let author = Number(body.author as string);
  let replyTo = Number(query.id);

  if (author < 1 || replyTo < 1) {
    let code = HttpCodes.BAD_REQ;
    res.status(code).json({
      isError: true,
      status: code,
      message: "wrong author or id number",
    });
    return;
  }

  if (!cookiewrapper.checkValidUser(req.cookies, parseInt(body.author))) {
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
      id: parseInt(query.id as string),
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
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(500).json({ isError: true, status: code, message: e.message });
    return;
  }

  let code = HttpCodes.CREATED;
  res
    .status(code)
    .json({
      isError: false,
      status: code,
      message: `User n°${p.authorId} replied to post n°${p.replyId} with post n°${p.id}`,
      data: p,
    });
}
