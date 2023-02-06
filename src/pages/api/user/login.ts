import { ApiResponse, HttpCodes } from "@/helper/constants";
import { removePassw, UserWithoutPass } from "@/helper/APIwrapper";
import { prisma } from "@/helper/instances";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ session: string; user: UserWithoutPass }>>
) {
  res.setHeader("Allow", ["POST"]);

  const { method, body } = req;

  if (method != "POST") {
    let code = HttpCodes.WRONG_METHOD;
    res.status(code).json({
      isError: true,
      status: code,
      message: `Method ${method} Not Allowed`,
    });
    return;
  }

  if (!(body.password && body.email)) {
    let code = HttpCodes.BAD_REQ;
    res.status(code).json({
      isError: true,
      status: code,
      message: "need a password and an email",
    });
    return;
  }

  try {
    var u = await prisma.user.findUnique({
      where: {
        email: body.email as string,
      },
      include: {
        posts: true,
        likes: true,
        followers: true,
        following: true,
      }
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  if (!u || body.password !== u.password) {
    let code = HttpCodes.UNAUTHORIZED;
    res.status(code).json({
      isError: true,
      status: code,
      message: "Wrong email or password",
    });
    return;
  }

  let code = HttpCodes.ACCEPTED;
  res.status(code).json({
    isError: false,
    status: code,
    data: {
      session: `${u.id}`,
      user: removePassw(u),
    },
    message: `Welcome ${u.username} (id:${u.id})`,
  });
}
