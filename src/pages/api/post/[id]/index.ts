import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes } from "@/helper/constants";
import {
  APIdecorator,
  prisma,
  isDigit,
  allPostInfoPrisma,
} from "@/helper/backendHelper";

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

  // TODO that's a lot of includes, maybe we should do it in the frontend or make it easier to read
  try {
    var p = await prisma.post.findUnique({
      where: {
        id: parseInt(query.id as string),
      },
      include: {
        ...allPostInfoPrisma,
        replies: {
          include: allPostInfoPrisma,
        },
        replyTo: {
          include: allPostInfoPrisma,
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
