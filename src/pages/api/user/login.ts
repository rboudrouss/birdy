import { ApiResponse, HttpCodes } from "@/helper/constants";
import { removePassw, UserWithoutPass } from "@/helper/APIwrapper";
import { APIdecorator, prisma } from "@/helper/backendHelper";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const APILoginHandler = APIdecorator(
  loginHandler,
  ["POST"], // formater hack
  {
    password: (s) => typeof s === "string" && s.length > 3 && s.length > 0,
    email: (s) => typeof s === "string" && s.length < 257 && s.length > 0,
  }
);
export default APILoginHandler;

export async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{ session: string; user: UserWithoutPass }>>
) {
  const { body } = req;

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
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  if (!u || !(await bcrypt.compare(body.password, u.password))) {
    let code = HttpCodes.UNAUTHORIZED;
    res.status(code).json({
      isError: true,
      status: code,
      message: "Wrong email or password",
    });
    return;
  }

  let session = generateSession(u.id);

  try {
    await prisma.session.create({
      data: {
        id: session,
        userId: u.id,
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  let code = HttpCodes.ACCEPTED;
  res.status(code).json({
    isError: false,
    status: code,
    data: {
      session: session,
      user: removePassw(u),
    },
    message: `Welcome ${u.username} (id:${u.id})`,
  });
}

function generateSession(id: number) {
  return `${randomBytes(5).toString("hex")}${Date.now().toString(16)}${id.toString(16)}`;
}
