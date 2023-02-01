import cookieWrapper from "@/helper/cookiewrapper";
import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, prisma } from "@/helper/constants";

const DEFAULT_N = 20;

// TODO maybe remove the author id in the request
export default async function postList(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Post[]>>
) {
  res.setHeader("Allow", ["GET"]);

  const { method, query } = req;
  const n = query.n ? parseInt(query.n as string) : DEFAULT_N;

  if (method != "GET") {
    let code = HttpCodes.WRONG_METHOD;
    res
      .status(code)
      .json({
        isError: true,
        status: code,
        message: `Method ${method} Not Allowed`,
      });
    return;
  }

  if (!cookieWrapper.isConnected(req.cookies)) {
    let code = HttpCodes.FORBIDDEN;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Not connected" });
    return;
  }

  try {
    var p = await prisma.post.findMany({
      take: n,
      orderBy: {
        createdAt: "desc",
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
      .json({ isError: true, status: code, message: "No Posts in Database" });
    return;
  }

  let code = HttpCodes.OK;
  res
    .status(code)
    .json({ isError: false, status: code, message: "Ok !", data: p });
}
