import cookieWrapper from "@/helper/cookiewrapper";
import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import { APIdecorator, findConnectedUser, prisma } from "@/helper/backendHelper";

const DEFAULT_N = 20;

const APIPostList = APIdecorator(
  postList,
  ["GET"],
  null, // formater hack
  {
    n: false, // false here means facultatif
    skip: false,
  }
);
export default APIPostList;

export async function postList(
  req: NextApiRequest,
  res: NextApiResponse<
    ApiResponse<{ start: number; end: number; n: number; data: Post[] }>
  >
) {
  const { query } = req;
  const n = isDigit(query.n as string)
    ? parseInt(query.n as string)
    : DEFAULT_N;
  let skip = isDigit(query.start as string)
    ? parseInt(query.skip as string)
    : undefined;

  if (await findConnectedUser(req.cookies.session) === -1) {
    let code = HttpCodes.FORBIDDEN;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Not connected" });
    return;
  }

  let requestobj: any = {
    take: n,
    skip: skip,
  };
  if (query.all) {
    requestobj = {};
    skip = 0;
  }

  try {
    var p = await prisma.post.findMany({
      ...requestobj,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        // FIXME do not send the password
        author: true,
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
  res.status(code).json({
    isError: false,
    status: code,
    message: "Ok !",
    data: {
      start: skip ?? 0,
      end: (skip ?? 0) + p.length,
      n: p.length,
      data: p,
    },
  });
}
