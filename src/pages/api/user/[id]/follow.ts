import cookieWrapper from "@/helper/cookiewrapper";
import { Follows } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes } from "@/helper/constants";
import { prisma } from "@/helper/instances";

/* body 
  author: number (author id, the follower)
*/
export default async function followHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Follows>>
) {
  res.setHeader("Allow", ["POST"]);

  const { method, query, body, cookies } = req;
  const userId = parseInt(query.id as string);

  if (method != "POST") {
    let code = HttpCodes.WRONG_METHOD;
    res.status(code).json({
      isError: true,
      status: code,
      message: `Method ${method} Not Allowed`,
    });
    return;
  }

  if (!body.author) {
    let code = HttpCodes.BAD_REQ;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Need the user id" });
    return;
  }

  const authorID = parseInt(body.author);

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
        followingId: parseInt(query.id as string),
        followerId: parseInt(body.author),
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
