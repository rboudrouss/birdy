import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes } from "@/helper/constants";
import { prisma } from "@/helper/instances";

// Liked option

export default async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Post>>
) {
  res.setHeader("Allow", ["GET"]);

  const { method, query } = req;

  if (method != "GET") {
    let code = HttpCodes.WRONG_METHOD;
    res.status(code).json({
      isError: true,
      status: code,
      message: `Methode ${method} Not allowed`,
    });
    return;
  }

  try {
    var p = await prisma.post.findUnique({
      where: {
        id: parseInt(query.id as string),
      },
      include: {
        author: true,
        likes: true,
        replies: true,
        replyTo: true,
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

  let code = HttpCodes.OK;
  res.status(code).json({
    isError: false,
    data: p,
    status: code,
    message: `Info of post with id ${query.id}`,
  });
}
