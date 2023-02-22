import cookieWrapper from "@/helper/cookiewrapper";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import { APIdecorator, findConnectedUser, prisma } from "@/helper/backendHelper";

const APIUnlikeHandler = APIdecorator(
  unlikeHandler,
  ["POST"],
  { author: Number.isInteger },
  { id: isDigit }
);
export default APIUnlikeHandler;

export async function unlikeHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
) {
  const { query, body, cookies } = req;

  const postId = parseInt(query.id as string);
  const userId = body.author as number;

  if (await findConnectedUser(cookies.session) !== userId) {
    let code = HttpCodes.FORBIDDEN;
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
    var l = await prisma.likes.delete({
      where: {
        userId_postId: {
          postId,
          userId,
        },
      },
    });
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: { nbLikes: { increment: -1 } },
    });
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: { nbLikes: { increment: -1 } },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  let code = HttpCodes.OK;
  res.status(code).json({
    isError: false,
    data: null,
    status: code,
    message: `User n°${l.postId} unliked post n°${l.postId}`,
  });
}
