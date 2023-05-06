import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, conditions, HttpCodes } from "@/helper/constants";
import {
  APIdecorator,
  findConnectedUser,
  prisma,
} from "@/helper/backendHelper";

const APIPostCreate = APIdecorator(
  postCreate,
  ["POST"], // formater hack
  {
    content: conditions.content,
    images: false,
    replyId: false,
  }
);
export default APIPostCreate;

// TODO add "post/[id]/reply" feature here
export async function postCreate(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Post>>
) {
  const { body } = req;

  let author = await findConnectedUser(req.cookies.session);
  let images = body.images ?? ([] as string[]);

  if (
    (body.replyId && !conditions.replyId(body.replyId)) ||
    (body.images && !conditions.images(images))
  ) {
    let code = HttpCodes.BAD_REQUEST;
    res.status(code).json({
      isError: true,
      status: code,
      message: "replyId or images are not valid",
    });
    return;
  }

  if (!author) {
    let code = HttpCodes.FORBIDDEN;
    res.status(code).json({
      isError: true,
      status: code,
      message: "not connected",
    });
    return;
  }

  if (body.replyId) {
    try {
      var parent = await prisma.post.findUnique({
        where: {
          id: body.replyId,
        },
      });
    } catch (e: any) {
      let code = HttpCodes.INTERNAL_ERROR;
      res
        .status(code)
        .json({ isError: true, status: code, message: e.message });
      return;
    }

    if (!parent) {
      let code = HttpCodes.NOT_FOUND;
      res.status(code).json({
        isError: true,
        status: code,
        message: "Parent post not found",
      });
      return;
    }

    try {
      p = await prisma.post.create({
        data: {
          content: body.content as string,
          authorId: author,
          replyId: body.replyId,
        },
      });
      await prisma.post.update({
        where: {
          id: body.replyId,
        },
        data: {
          nbReplies: { increment: 1 },
        },
      });
    } catch (e: any) {
      let code = HttpCodes.INTERNAL_ERROR;
      res
        .status(code)
        .json({ isError: true, status: code, message: e.message });
      return;
    }
  } else {
    try {
      var p = await prisma.post.create({
        data: {
          content: body.content as string,
          authorId: author,
        },
      });
    } catch (e: any) {
      let code = HttpCodes.INTERNAL_ERROR;
      res
        .status(code)
        .json({ isError: true, status: code, message: e.message });
      return;
    }
  }

  let code = HttpCodes.CREATED;
  res
    .status(code)
    .json({ isError: false, status: code, message: "Created !", data: p });
}
