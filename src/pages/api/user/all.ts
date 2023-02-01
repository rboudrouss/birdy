import { ApiResponse, HttpCodes, prisma } from "@/helper/constants";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { connected } from "process";

export default async function userAll(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<User[]>>
) {
  res.setHeader("Allow", ["GET"]);

  const { method } = req;

  if (method !== "GET") {
    let code = HttpCodes.WRONG_METHOD;
    res.status(code).json({
      isError: true,
      status: code,
      message: `Method ${method} Not Allowed`,
    });
    return;
  }

  try {
    var u = await prisma.user.findMany();
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({ isError: true, status: code, message: e.message });
    return;
  }

  let code = HttpCodes.OK;
  res
    .status(code)
    .json({ isError: false, status: code, message: "OK !", data: u });
  return;
}
