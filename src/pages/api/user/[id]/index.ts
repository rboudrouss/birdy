import { ApiResponse, conditions, HttpCodes } from "@/helper/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { removePassw, UserWithoutPass } from "@/helper/APIwrapper";
import {
  APIdecorator,
  prisma,
  isDigit,
  verifyQuery,
} from "@/helper/backendHelper";
import bcrypt from "bcryptjs";

// TODO more security in this function
// TODO add password hashing

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

async function userHandler(
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
        posts: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            images: true,
            replyTo: {
              include: {
                author: true,
              },
            },
          },
        },
        followers: true,
        following: true,
        likes: true,
        postsImages: true,
        coverImage: true,
        ppImage: true,
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
    (body.username && !conditions.username(body.username)) ||
    (body.email && !conditions.email(body.email)) ||
    (body.password && !conditions.password(body.password)) ||
    (body.bio && !conditions.bio(body.bio))
  ) {
    let code = HttpCodes.BAD_REQUEST;
    res
      .status(code)
      .json({ isError: true, status: code, message: "Incorrect attributes" });
    return;
  }

  let password: string | null = null;
  if (body.password) password = await bcrypt.hash(body.password as string, 10);

  try {
    var u2 = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email: (body.email as string) ?? u.email,
        username: (body.username as string) ?? u.username,
        password: password ?? u.password,
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
