import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes } from "@/helper/constants";
import {
  APIdecorator,
  prisma,
  isDigit,
  allPostInfoPrisma,
  findConnectedUser,
} from "@/helper/backendHelper";

const APIpostHander = APIdecorator(
  postHandler,
  ["GET", "DELETE"],
  null, // formater hack
  { id: isDigit }
);
export default APIpostHander;

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Post | null>>
) {
  const { query, method, cookies } = req;
  const postId = parseInt(query.id as string);

  try {
    var p = await prisma.post.findUnique({
      where: {
        id: postId,
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

  if (method === "GET") {
    let code = HttpCodes.OK;
    res.status(code).json({
      isError: false,
      data: p,
      status: code,
      message: `Info of post with id ${postId}`,
    });
    return;
  }

  // Method is DELETE
  if ((await findConnectedUser(cookies.session)) !== p.authorId) {
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
  return;
}
