import { APIdecorator, prisma } from "@/helper/backendHelper";
import { ApiResponse, HttpCodes } from "@/helper/constants";
import { NextApiRequest, NextApiResponse } from "next";
import type { Image } from "@prisma/client";

const APIImageAll = APIdecorator(
  imageAll,
  ["GET"] // formater hack
);
export default APIImageAll;

async function imageAll(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Image[]>>
) {
  try {
    var images = await prisma.image.findMany();
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({
      isError: true,
      status: code,
      message: e?.message,
    });
    return;
  }

  let code = HttpCodes.OK;
  res.status(code).json({
    isError: false,
    status: code,
    message: "ok",
    data: images,
  });
}
