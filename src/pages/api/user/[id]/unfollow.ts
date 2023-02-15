import cookieWrapper from "@/helper/cookiewrapper";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import { APIdecorator, prisma } from "@/helper/instances";

const APIUnfollowHandler = APIdecorator(
  unfollowHandler,
  ["POST"],
  {
    author: Number.isInteger,
  },
  { id: isDigit }
);

export default APIUnfollowHandler;

export async function unfollowHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
) {
  const { query, body, cookies } = req;
  const userId = parseInt(query.id as string);
  const authorId = body.author as number;

  if (cookieWrapper.back.checkValidUser(cookies, authorId)) {
    let code = HttpCodes.FORBIDDEN;
    res.status(code).json({
      isError: true,
      status: code,
      message: "Unauthorized, not current connected User",
    });
    return;
  }

  try {
    var u = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  if (!u) {
    let code = HttpCodes.NOT_FOUND;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Post not found" });
    return;
  }

  try {
    var f = await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followingId: userId,
          followerId: authorId,
        },
      },
    });
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nbFollowers: { increment: -1 },
      },
    });
    await prisma.user.update({
      where: {
        id: authorId,
      },
      data: {
        nbFollowing: { increment: -1 },
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  let code = HttpCodes.CREATED;
  res.status(code).json({
    isError: false,
    status: code,
    message: "Unfollowed !",
    data: null,
  });
}
