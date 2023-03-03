// only recommended to use as Post request, GET is only for testing
import { ApiResponse, HttpCodes, IMAGEAPI, IMGEXT, UPLOADFOLDER } from "@/helper/constants";
import {
  APIdecorator,
  findConnectedUser,
  isDigit,
  prisma,
} from "@/helper/backendHelper";
import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import ImageHelper from "@/helper/ImageHelper";
import { randomUUID } from "crypto";

const APIimageGetter = APIdecorator(
  imageGetter,
  ["POST", "GET"], // formater hack
  null,
  {
    id: isDigit,
    type: (s) => typeof s === "string" || typeof s === "undefined",
  }
);

export default APIimageGetter;

async function imageGetter(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<string>>
) {
  let URL = process.env.URL;

  if (!URL) {
    let code = HttpCodes.INTERNAL_ERROR;
    res.status(code).json({
      isError: true,
      status: code,
      message: "env URL not set",
    });
    return;
  }

  const { cookies, method, query } = req;

  const id = parseInt(query.id as string);
  const type = query.type as string | undefined;

  // Verify if user exists
  try {
    var userObj = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
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

  if (!userObj) {
    let code = HttpCodes.NOT_FOUND;
    res.status(code).json({
      isError: true,
      status: code,
      message: "user not found",
    });
    return;
  }

  // <!> Deprecated
  if (method === "GET") {
    try {
      var user2 = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          ppImage: {
            select: {
              imageId: true,
            },
          },
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

    if (!user2?.ppImage?.imageId) {
      let image = fs.readFileSync("public/avatar.jpg");
      let out = new Blob([image]);
      let code = HttpCodes.OK;
      res.setHeader("Content-Type", "image/jpeg");
      res.status(code).end(Buffer.from(await out.arrayBuffer()));
      return;
    }

    let imageBlob;
    try {
      imageBlob = await fetch(`${URL}/api/image/${user2.ppImage.imageId}`).then(
        (r) => r.blob()
      );
    } catch (e: any) {
      let code = HttpCodes.NOT_FOUND;
      res.status(code).json({
        isError: true,
        status: code,
        message: "Image not found\n" + e.message ?? "",
      });
      return;
    }

    res.setHeader("Content-Type", "image/jpg");
    // HACK but hey it works
    res.end(Buffer.from(await imageBlob.arrayBuffer()));
  }

  // TODO Try catch this thing
  let user = await findConnectedUser(cookies.session);

  if (user !== id) {
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

  let filename = `${randomImgName()}.${extension}`;

  fs.renameSync(image.filepath, `${UPLOADFOLDER}/${filename}`);

  let prismaInstance;
  if (type === "cover") prismaInstance = prisma.coverImage;
  else prismaInstance = prisma.ppImage;

  try {
    await prisma.image.create({
      data: {
        id: filename,
        userId: user,
      },
    });

    // deleteMany so no need to check if image exists (doesn't raise error)
    await prismaInstance.deleteMany({
      where: {
        userId: id,
      },
    });

    // HACK any mais trop relou de typer ça correctement
    await (prismaInstance as any).create({
      data: {
        userId: id,
        imageId: filename,
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


function randomImgName() {
  return `${randomUUID().split("-").join("")}${Date.now()
    .toString(16)
    .slice(-4)}`;
}
