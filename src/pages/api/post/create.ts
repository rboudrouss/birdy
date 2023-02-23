import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes } from "@/helper/constants";
import {
  APIdecorator,
  findConnectedUser,
  prisma,
} from "@/helper/backendHelper";

const APIPostCreate = APIdecorator(
  postCreate,
  ["POST"], // formater hack
  {
    author: Number.isInteger,
    content: (x) => typeof x === "string" && x.length < 256 && x.length > 0,
  }
);
export default APIPostCreate;

// TODO add "post/[id]/reply" feature here
export async function postCreate(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Post>>
) {
  const { body } = req;

  let author = body.author as number;

  if ((await findConnectedUser(req.cookies.session)) !== author) {
    let code = HttpCodes.FORBIDDEN;
    res.status(code).json({
      isError: true,
      status: code,
      message: "wrong cookie, wrong account",
    });
    return;
  }

  try {
    var p = await prisma.post.create({
      data: {
        content: body.content as string,
        authorId: author,
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  let code = HttpCodes.CREATED;
  res
    .status(code)
    .json({ isError: false, status: code, message: "Created !", data: p });
}
