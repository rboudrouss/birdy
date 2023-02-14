import cookieWrapper from "@/helper/cookiewrapper";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import { prisma } from "@/helper/instances";

export default async function likeHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
) {
  res.setHeader("Allow", ["DELETE"]);

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

  if (method != "DELETE") {
    let code = HttpCodes.WRONG_METHOD;
    res.status(code).json({
      isError: true,
      status: code,
      message: `Method ${method} Not Allowed`,
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
    res.status(code).json({
      isError: true,
      status: code,
      message: e.message as string,
    });
    return;
  }

  if (!p) {
    let code = HttpCodes.NOT_FOUND;
    res.status(code).json({
      isError: true,
      status: code,
      message: "Post Not Found",
    });
    return;
  }

  if(!cookieWrapper.back.checkValidUser(cookies, p.authorId)) {
    let code = HttpCodes.UNAUTHORIZED;
    res.status(code).json({
      isError: true,
      status: code,
      message: "You are not authorized to delete this post",
    });
    return;
  }
  


  try {
    await prisma.post.delete({
      where: {
        id: postId,
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
    status: code,
    data: null,
    message: `Post n°${query.id} has been deleted successfully`,
  });
}
