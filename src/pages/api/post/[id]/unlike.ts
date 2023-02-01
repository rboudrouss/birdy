import cookieWrapper from "@/helper/cookiewrapper";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, prisma } from "@/helper/constants";

// TODO maybe remove the author id in the request
export default async function unlikeHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
) {
  res.setHeader("Allow", ["POST"]);

  const { method, query, body, cookies } = req;

  if (method != "POST") {
    let code = HttpCodes.WRONG_METHOD;
    res.status(405).json({
      isError: true,
      status: code,
      message: `Method ${method} Not Allowed`,
    });
    return;
  }

  if (!body.user) {
    let code = HttpCodes.BAD_REQ;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Need the user id" });
    return;
  }

  if (cookieWrapper.checkValidUser(cookies, parseInt(body.author))) {
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
        id: parseInt(query.id as string),
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
          postId: parseInt(query.id as string),
          userId: parseInt(body.author),
        },
      },
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
