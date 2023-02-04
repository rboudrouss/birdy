import { ApiResponse, HttpCodes } from "@/helper/constants";
import { removePassw, UserWithoutPass } from "@/helper/DBtoObj";
import { prisma } from "@/helper/instances";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function userAll(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserWithoutPass[]>>
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

  let out = u.map(removePassw);

  let code = HttpCodes.OK;
  res
    .status(code)
    .json({ isError: false, status: code, message: "OK !", data: out });
  return;
}
