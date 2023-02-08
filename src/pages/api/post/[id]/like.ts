import cookieWrapper from "@/helper/cookiewrapper";
import { Likes } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import { prisma } from "@/helper/instances";

export default async function likeHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Likes>>
) {
  res.setHeader("Allow", ["POST"]);

  const { method, query, body, cookies } = req;

  if (!isDigit(query.id as string)) {
    let code = HttpCodes.BAD_REQ;
    res.status(code).json({
      isError: true,
      status: code,
      message: `id ${query.id} is not a number`,
    });
    return;
  }

  const postId = parseInt(query.id as string);

  if (method != "POST") {
    let code = HttpCodes.WRONG_METHOD;
    res.status(code).json({
      isError: true,
      status: code,
      message: `Method ${method} Not Allowed`,
    });
    return;
  }

  if (!body.author && !isDigit(body.author) && parseInt(body.author) < 1) {
    let code = HttpCodes.BAD_REQ;
    res
      .status(code)
      .json({
        isError: true,
        status: code,
        message: `Inexistant or incorrect author Id, got ${body.author}`,
      });
    return;
  }

  const userId = parseInt(body.author);

  if (cookieWrapper.back.checkValidUser(cookies, userId)) {
    let code = HttpCodes.UNAUTHORIZED;
    res.status(code).json({
      isError: true,
      status: code,
      message: "Unauthorized, not current connected User",
    });
    return;
  }

  try {
    var p = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  if (!p) {
    let code = HttpCodes.NOT_FOUND;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Post not found" });
    return;
  }

  try {
    var l = await prisma.likes.create({
      data: {
        postId,
        userId,
      },
    });
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: { nbLikes: { increment: 1 } },
    });
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: { nbLikes: { increment: 1 } },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  let code = HttpCodes.OK;
  res.status(code).json({
    isError: false,
    status: code,
    data: l,
    message: `User n°${l.postId} likes post n°${l.postId}`,
  });
}
