import cookieWrapper from "@/helper/cookiewrapper";
import { Likes } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import { APIdecorator, findConnectedUser, prisma } from "@/helper/backendHelper";

const APILikeHandler = APIdecorator(
  likeHandler,
  ["POST"],
  { author: Number.isInteger },
  { id: isDigit }
);
export default APILikeHandler;

export async function likeHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Likes>>
) {
  const { query, body, cookies } = req;

  const postId = parseInt(query.id as string);

  const userId = body.author as number;

  if (await findConnectedUser(cookies.session) !== userId) {
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
