import cookieWrapper from "@/helper/cookiewrapper";
import { Follows } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, HttpCodes, } from "@/helper/constants";
import { prisma } from "@/helper/instances";

export default async function followHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Follows>>
) {
  res.setHeader("Allow", ["POST"]);

  const { method, query, body, cookies } = req;

  if (method != "POST") {
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

  if (!body.user) {
    let code = HttpCodes.BAD_REQ;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Need the user id" });
    return;
  }

  if (cookieWrapper.back.checkValidUser(cookies, parseInt(body.author))) {
    let code = HttpCodes.FORBIDDEN;
    res
      .status(code)
      .json({
        isError: true,
        status: code,
        message: "Unauthorized, not current connected User",
      });
    return;
  }

  try {
    var u = await prisma.user.findUnique({
      where: {
        id: parseInt(query.id as string),
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  if (!u) {
    let code = HttpCodes.NOT_FOUND;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Post not found" });
    return;
  }

  try {
    var f = await prisma.follows.create({
      data: {
        followingId: parseInt(query.id as string),
        followerId: parseInt(body.author),
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
    .json({ isError: false, status: code, message: "Followed !", data: f });
}
