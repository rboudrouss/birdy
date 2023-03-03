import {
  ApiResponse,
  HttpCodes,
  IMAGEAPI,
  IMGEXT,
  MAXIMGSIZE,
  UPLOADFOLDER,
} from "@/helper/constants";
import {
  APIdecorator,
  findConnectedUser,
  isDigit,
  prisma,
} from "@/helper/backendHelper";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { randomUUID } from "crypto";

const APIimageGetter = APIdecorator(
  imageGetter,
  ["POST", "GET"] // formater hack
);

export default APIimageGetter;

// TODO add support for multiple images
async function imageGetter(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<string>>
) {
  // let imgServer = process.env.IMG_SERVER;

  // if (!imgServer) {
  //   let code = HttpCodes.INTERNAL_ERROR;
  //   res.status(code).json({
  //     isError: true,
  //     status: code,
  //     message: "env IMG_SERVER not set",
  //   });
  //   return;
  // }

  const { cookies, method, query } = req;

  let user;

  if (query.secret === process.env.SECRET) {
    if (!isDigit(query.id)) {
      let code = HttpCodes.BAD_REQUEST;
      res.status(code).json({
        isError: true,
        status: code,
        message: "no id",
      });
      return;
    }
    user = parseInt(query.id as string);
  } else user = await findConnectedUser(cookies.session);

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
      `<form action="${IMAGEAPI}" method="post" enctype="multipart/form-data"><input type="file" name="file" id="file"><input type="submit" value="Upload" name="submit"></form>`
    );
    return;
  }

  const result = await parseForm(req);

  let image = Object.values(result.files)[0] as formidable.File | undefined;

  let extension = image?.originalFilename?.split(".")[1] ?? "";

  if (!image || !IMGEXT.includes(extension)) {
    let code = HttpCodes.BAD_REQUEST;
    res.status(code).json({
      isError: true,
      status: code,
      message: "no supported image or no extension",
    });
    return;
  }

  let newName = `${randomImgName()}.${extension}`;

  fs.renameSync(image.filepath, `${UPLOADFOLDER}/${newName}`);

  try {
    await prisma.image.create({
      data: {
        id: newName,
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
    data: newName,
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
    const form = new formidable.IncomingForm({
      multiples: true,
      maxFileSize: MAXIMGSIZE,
      uploadDir: UPLOADFOLDER,
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

function randomImgName() {
  return `${randomUUID().split("-").join("")}${Date.now()
    .toString(16)
    .slice(-4)}`;
}
