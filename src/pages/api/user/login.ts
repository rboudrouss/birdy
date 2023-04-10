import { ApiResponse, conditions, HttpCodes, sessionTTL } from "@/helper/constants";
import { removePassw, UserWithoutPass } from "@/helper/APIwrapper";
import { APIdecorator, generateSession, prisma } from "@/helper/backendHelper";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

const APILoginHandler = APIdecorator(
  loginHandler,
  ["POST"], // formater hack
  {
    password: conditions.password,
    email: conditions.email,
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
        expires: new Date(Date.now() + sessionTTL),
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
