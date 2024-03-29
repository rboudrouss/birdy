import { Likes } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, conditions, HttpCodes } from "@/helper/constants";
import {
  APIdecorator,
  findConnectedUser,
  prisma,
  isDigit,
} from "@/helper/backendHelper";

const APILikeHandler = APIdecorator(
  likeHandler,
  ["POST"],
  null,
  { id: isDigit }
);
export default APILikeHandler;

export async function likeHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Likes>>
) {
  const { query, body, cookies } = req;

  const postId = parseInt(query.id as string);

  const userId = await findConnectedUser(cookies.session);

  if (!userId) {
    let code = HttpCodes.UNAUTHORIZED;
    res.status(code).json({
      isError: true,
      status: code,
      message: "Not connected",
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
