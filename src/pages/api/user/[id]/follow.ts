import { Follows } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes } from "@/helper/constants";
import {
  APIdecorator,
  findConnectedUser,
  prisma,
  isDigit,
} from "@/helper/backendHelper";

const APIFollowHandler = APIdecorator(
  followHandler,
  ["POST"],
  null,
  { id: isDigit }
);
export default APIFollowHandler;

export async function followHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Follows>>
) {
  const { query, body, cookies } = req;
  const userId = parseInt(query.id as string);
  const authorID = await findConnectedUser(cookies.session);

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

  if (!authorID) {
    let code = HttpCodes.FORBIDDEN;
    res.status(code).json({
      isError: true,
      status: code,
      message: "Not Connected",
    });
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
