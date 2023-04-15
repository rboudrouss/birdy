import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes } from "@/helper/constants";
import {
  APIdecorator,
  prisma,
  isDigit,
  allPostInfoPrisma,
} from "@/helper/backendHelper";

const DEFAULT_N = 20;

const APIPostList = APIdecorator(
  postList,
  ["GET"],
  null, // formater hack
  {
    // false means not required
    all: false, // if true, return all posts
    n: false, // if all is false, return <n> posts
    skip: false, // if all is false, skip <skip> first posts
    replies: false, // if true, include replies to posts
    follow: false, // if true, return posts only from followed users
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
  let follow = !!query.follow;

  let requestobj: any = {
    take: n,
    skip: skip,
  };
  if (query.all) {
    requestobj = {};
    skip = 0;
  }

  if (follow) {
    if (!req.cookies.session) {
      let code = HttpCodes.UNAUTHORIZED;
      res
        .status(code)
        .json({ isError: true, status: code, message: "Not logged in" });
      return;
    }

    try {
      var session = await prisma.session.findUnique({
        where: {
          id: req.cookies.session,
        },
        include: {
          user: {
            include: {
              following: true,
            },
          },
        },
      });
    } catch (e: any) {
      let code = HttpCodes.INTERNAL_ERROR;
      res
        .status(code)
        .json({ isError: true, status: code, message: e.message });
      return;
    }

    if (!session) {
      let code = HttpCodes.UNAUTHORIZED;
      res
        .status(code)
        .json({ isError: true, status: code, message: "Not logged in" });
      return;
    }

    if (!session.user.following) {
      let code = HttpCodes.OK;
      res.status(code).json({
        isError: false,
        status: code,
        message: "Ok !",
        data: {
          start: 0,
          end: 0,
          n: 0,
          data: [],
        },
      });
      return;
    }

    let following = session.user.following.map((f) => {
      return { authorId: f.followingId };
    });
    console.log(following)

    try {
      var p2 = await prisma.post.findMany({
        where: {
          AND: [
            {
              OR: following,
            },
            {
              replyId: replies ? undefined : null,
            },
          ],
        },
        ...requestobj,
        orderBy: {
          createdAt: "desc",
        },
        // FIXME do not send the password
        include: allPostInfoPrisma,
      });
    } catch (e: any) {
      let code = HttpCodes.INTERNAL_ERROR;
      res
        .status(code)
        .json({ isError: true, status: code, message: e.message });
      return;
    }

    let code = HttpCodes.OK;
    res.status(code).json({
      isError: false,
      status: code,
      message: "Ok !",
      data: {
        start: skip ?? 0,
        end: (skip ?? 0) + p2.length,
        n: p2.length,
        data: p2,
      },
    });
    return;
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
      // FIXME do not send the password
      include: allPostInfoPrisma,
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
