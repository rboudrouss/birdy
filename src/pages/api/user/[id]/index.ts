import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { removePassw, UserWithoutPass } from "@/helper/APIwrapper";
import { APIdecorator, prisma } from "@/helper/instances";

// TODO more security in this function

const APIUserHandler = APIdecorator(
  userHandler,
  ["GET", "PUT"],
  {
    email: false,
    username: false,
    password: false,
    bio: false,
  },
  { id: isDigit }
);

export default APIUserHandler;

export async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserWithoutPass>>
) {
  const { body, query, method } = req;
  const id = parseInt(query.id as string);

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

  // Methode is then PUT

  if (
    !["email", "username", "password", "bio"]
      .map((e) => !body[e] || (body[e] && typeof body[e] === "string"))
      .every((e) => e)
  ) {
    let code = HttpCodes.BAD_REQ;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Incorect attributes" });
  }

  try {
    var u2 = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email: (body.email as string) ?? u.email,
        username: (body.username as string) ?? u.username,
        password: (body.password as string) ?? u.password,
        bio: (body.bio as string) ?? u.bio,
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
    message: "changed !",
    data: removePassw(u2),
  });
  return;
}
