import { ApiResponse, HttpCodes } from "@/helper/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { removePassw, UserWithoutPass } from "@/helper/APIwrapper";
import { prisma } from "@/helper/instances";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserWithoutPass>>
) {
  res.setHeader("Allow", ["GET", "PUT"]);

  const { query, method } = req;
  const id = parseInt(query.id as string, 10);

  try {
    var u = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        posts: true,
        followers: true,
        following: true,
        likes: true,
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
      .json({ isError: true, status: code, message: "User Not Found" });
    return;
  }

  if (method == "GET") {
    let code = HttpCodes.OK;
    res.status(code).json({
      isError: false,
      status: code,
      message: "OK !",
      data: removePassw(u),
    });
    return;
  }

  if (method == "PUT") {
    try {
      var u2 = await prisma.user.update({
        where: {
          id,
        },
        data: {
          email: (query.email as string) ?? u.email,
          username: (query.username as string) ?? u.username,
          password: (query.password as string) ?? u.password,
          bio: (query.bio as string) ?? u.bio,
        },
      });
    } catch (e: any) {
      let code = HttpCodes.INTERNAL_ERROR;
      res
        .status(code)
        .json({ isError: true, status: code, message: e.message });
      return;
    }

    let code = HttpCodes.ACCEPTED;
    res.status(code).json({
      isError: false,
      status: code,
      message: "changed !",
      data: removePassw(u2),
    });
    return;
  }

  let code = HttpCodes.WRONG_METHOD;
  res.status(code).json({
    isError: true,
    status: code,
    message: `Method ${method} Not Allowed`,
  });
}
