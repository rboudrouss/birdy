import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import { APIdecorator, prisma } from "@/helper/instances";

const APIpostHander = APIdecorator(
  postHandler,
  ["GET"],
  null, // formater hack
  { id: isDigit }
);

export default APIpostHander;

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Post>>
) {
  const { query } = req;

  try {
    var p = await prisma.post.findUnique({
      where: {
        id: parseInt(query.id as string),
      },
      include: {
        author: true,
        likes: true,
        replies: {
          include: {
            author: true,
          },
        },
        replyTo: {
          include: {
            author: true,
          },
        },
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
