import { ApiResponse, HttpCodes } from "@/helper/constants";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<null>>
) {
  let code = HttpCodes.OK;
  res
    .status(code)
    .json({ isError: false, message: "OK o/", status: code, data: null });
}
