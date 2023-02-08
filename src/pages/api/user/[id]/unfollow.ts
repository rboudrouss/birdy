import cookieWrapper from "@/helper/cookiewrapper";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import { prisma } from "@/helper/instances";

/* body 
  author : number (author id, the user unfollowing)
*/
export default async function unfollowHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
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

  if (!body.author && !isDigit(body.author) && parseInt(body.author) < 1) {
    let code = HttpCodes.BAD_REQ;
    res
      .status(code)
      .json({
        isError: true,
        status: code,
        message: `Inexistant or incorrect author id, got ${body.author}`,
      });
    return;
  }

  const authorId = parseInt(body.author);

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
