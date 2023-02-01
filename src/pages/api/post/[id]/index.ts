import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, prisma } from "@/helper/constants";

// TODO maybe remove the author id in the request
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
    message: `Info of post with is ${query.id}`,
  });
}
