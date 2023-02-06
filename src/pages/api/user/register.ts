import { ApiResponse, HttpCodes } from "@/helper/constants";
import { removePassw, UserWithoutPass } from "@/helper/APIwrapper";
import { prisma } from "@/helper/instances";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserWithoutPass>>
) {
  res.setHeader("Allow", ["POST"]);

  const { body, method } = req;

  if (method != "POST") {
    let code = HttpCodes.WRONG_METHOD;
    res.status(code).json({
      isError: true,
      status: code,
      message: `Method ${method} Not Allowed`,
    });
    return;
  }

  if (
    !(body.password && body.email && body.username) ||
    (body.bio && body.bio.length > 256)
  ) {
    let code = HttpCodes.BAD_REQ;
    res.status(code).json({
      isError: true,
      status: code,
      message:
        "need a password, an email and a name. Optionnaly a bio with less than 256 characters",
    });
    return;
  }

  try {
    var old = await prisma.user.findUnique({
      where: {
        email: body.email as string,
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  if (old) {
    let code = HttpCodes.UNAUTHORIZED;
    res
      .status(code)
      .json({ isError: true, status: code, message: "email already used" });
    return;
  }

  try {
    var u = await prisma.user.create({
      data: {
        email: body.email as string,
        username: body.username as string,
        password: body.password as string,
        bio: (body.bio as string | undefined) ?? null,
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  let code = HttpCodes.CREATED;
  res.status(code).json({
    isError: false,
    status: code,
    message: `User ${u.username} with id ${u.id} was created !`,
    data: removePassw(u),
  });
}
