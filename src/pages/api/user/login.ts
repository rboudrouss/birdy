import { ApiResponse, HttpCodes } from "@/helper/constants";
import { removePassw, UserWithoutPass } from "@/helper/APIwrapper";
import { APIdecorator, prisma } from "@/helper/instances";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

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
