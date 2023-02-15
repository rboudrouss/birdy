import cookieWrapper from "@/helper/cookiewrapper";
import { Follows } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import { APIdecorator, prisma } from "@/helper/instances";

const APIFollowHandler = APIdecorator(
  followHandler,
  ["POST"],
  { author: Number.isInteger },
  { id: isDigit }
);

export default APIFollowHandler;

export async function followHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Follows>>
) {
  const { query, body, cookies } = req;
  const userId = parseInt(query.id as string);
  const authorID = body.author as number;

  if (cookieWrapper.back.checkValidUser(cookies, authorID)) {
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
    var f = await prisma.follows.create({
      data: {
        followingId: userId,
        followerId: authorID,
      },
    });
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        nbFollowers: { increment: 1 },
      },
    });
    await prisma.user.update({
      where: {
        id: authorID,
      },
      data: {
        nbFollowing: { increment: 1 },
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  let code = HttpCodes.CREATED;
  res
    .status(code)
    .json({ isError: false, status: code, message: "Followed !", data: f });
}
