import { ApiResponse, HttpCodes } from "@/helper/constants";
import { removePassw, UserWithoutPass } from "@/helper/APIwrapper";
import { APIdecorator, prisma } from "@/helper/backendHelper";
import type { NextApiRequest, NextApiResponse } from "next";

const APIUserAll = APIdecorator(userAll, ["GET"]);
export default APIUserAll;

export async function userAll(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<UserWithoutPass[]>>
) {
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
