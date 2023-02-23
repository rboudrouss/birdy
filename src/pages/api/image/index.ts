import { ApiResponse, HttpCodes } from "@/helper/constants";
import {
  APIdecorator,
  findConnectedUser,
  prisma,
} from "@/helper/backendHelper";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const APIimageHandler = APIdecorator(
  imageHandler,
  ["POST"] // formater hack
);

export default APIimageHandler;

async function imageHandler(
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

  const { cookies } = req;

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

  const result = await parseForm(req);

  let image = Object.values(result.files)[0] as formidable.File | undefined;

  if (!image) {
    let code = HttpCodes.BAD_REQ;
    res.status(code).json({
      isError: true,
      status: code,
      message: "no image",
    });
    return;
  }

  let imageBlob = new Blob([fs.readFileSync(image.filepath)]);

  let formData = new FormData();
  formData.append("file", imageBlob, "image.jpg");

  let response = await fetch(imgServer, {
    method: "POST",
    body: formData,
  })

  const {filename} = await response.json();

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
      message: e.message + " nyah",
    });
    return;
  }

  let code = HttpCodes.CREATED;
  res.status(code).json({
    isError: false,
    status: code,
    message: "Created !",
    data: filename.split(".")[0],
  });
}

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
