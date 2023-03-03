import { ErrorApiResponse, HttpCodes } from "@/helper/constants";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Deprecated, too slow
export default async function imageHandler(
  req: NextApiRequest,
  res: NextApiResponse<ErrorApiResponse | Blob>
) {
  const { query } = req;

  const id = query.id as string;

  let imgServer = process.env.IMG_SERVER;

  if (!imgServer) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({
      isError: true,
      status: code,
      message: "env IMG_SERVER not set",
    });
    return;
  }

  try {
    var response = await fetch(`/uploads/${id}`);
  } catch (e) {
    let code = HttpCodes.NOT_FOUND;
    res.status(code).json({
      isError: true,
      status: code,
      message: "Image not found",
    });
    return;
  }

  let imageBlob = await response.blob();

  res.setHeader("Content-Type", "image/jpg");
  // HACK but hey it works
  res.end(Buffer.from(await imageBlob.arrayBuffer()));
}
