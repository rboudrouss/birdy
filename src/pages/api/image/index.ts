import { ApiResponse, HttpCodes } from "@/helper/constants";
import {
  APIdecorator,
  findConnectedUser,
  prisma,
} from "@/helper/backendHelper";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import ImageHelper from "@/helper/ImageHelper";

const APIimageGetter = APIdecorator(
  imageGetter,
  ["POST", "GET"] // formater hack
);

export default APIimageGetter;

async function imageGetter(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<string>>
) {
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

  const { cookies, method } = req;

  let user = await findConnectedUser(cookies.session);

  if (user === -1) {
    let code = HttpCodes.FORBIDDEN;
    res.status(code).json({
      isError: true,
      status: code,
      message: "not connected",
    });
    return;
  }

  if (method === "GET") {
    res.status(HttpCodes.OK);
    res.setHeader("content-type", "text/html");
    res.end(
      `<form action="/api/image" method="post" enctype="multipart/form-data"><input type="file" name="file" id="file"><input type="submit" value="Upload" name="submit"></form>`
    );
    return;
  }

  const result = await parseForm(req);

  let image = Object.values(result.files)[0] as formidable.File | undefined;

  if (!image) {
    let code = HttpCodes.BAD_REQUEST;
    res.status(code).json({
      isError: true,
      status: code,
      message: "no image",
    });
    return;
  }

  let imageBlob = new Blob([fs.readFileSync(image.filepath)]);

  let response = await ImageHelper.postBlob(imageBlob, imgServer);

  let { filename } = await response.json();

  filename = filename.split(".")[0];

  try {
    await prisma.image.create({
      data: {
        id: filename,
        userId: user,
      },
    });
  } catch (e: any) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({
      isError: true,
      status: code,
      message: e.message,
    });
    return;
  }

  let code = HttpCodes.CREATED;
  res.status(code).json({
    isError: false,
    status: code,
    message: "Created !",
    data: filename,
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(
  req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}
