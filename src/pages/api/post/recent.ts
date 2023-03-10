import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes } from "@/helper/constants";
import {
  APIdecorator,
  findConnectedUser,
  prisma,
  isDigit,
} from "@/helper/backendHelper";

const DEFAULT_N = 20;

const APIPostList = APIdecorator(
  postList,
  ["GET"],
  null, // formater hack
  {
    n: false, // false here means facultatif
    skip: false,
    replies: false,
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
  let skip = isDigit(query.skip as string)
    ? parseInt(query.skip as string)
    : undefined;
  let replies = !!query.replies;

  if ((await findConnectedUser(req.cookies.session)) === -1) {
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
      where: {
        replyId: replies ? { not: null } : null,
      },
      ...requestobj,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        // FIXME do not send the password
        author: {
          include: {
            ppImage: true,
          },
        },
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
