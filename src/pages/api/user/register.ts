import { ApiResponse, HttpCodes } from "@/helper/constants";
import { removePassw, UserWithoutPass } from "@/helper/APIwrapper";
import { APIdecorator, prisma } from "@/helper/instances";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

const APIRegisterHandler = APIdecorator(
  registerHandler,
  ["POST"], // formater hack
  {
    username: (s) => typeof s === "string" && s.length <= 20 && s.length > 0,
    email: (s) => typeof s === "string" && s.length <= 256 && s.length > 0,
    password: (s) => typeof s === "string" && s.length > 3,
    bio: false,
  }
);
export default APIRegisterHandler;

export async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserWithoutPass>>
) {
  const { body } = req;

  if (
    !body.bio ||
    (body.bio &&
      !(
        typeof body.bio === "string" &&
        body.bio.length <= 256 &&
        body.bio.length > 0
      ))
  ) {
    let code = HttpCodes.BAD_REQ;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Bio is wrong type" });
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

  console.log("salt: ", process.env.salt);
  let hash = await bcrypt.hash(body.password as string, 10);

  try {
    var u = await prisma.user.create({
      data: {
        email: body.email as string,
        username: body.username as string,
        password: hash,
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
