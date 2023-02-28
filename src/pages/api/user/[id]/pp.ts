// FIXME maybe a bad idea to proxy it like that
// take too much time and if lots of defaults will re-download the same image
// je proxy déjà une fois bon, pas besoin de le faire 2 fois
import { ApiResponse, HttpCodes } from "@/helper/constants";
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

const APIimageGetter = APIdecorator(
  imageGetter,
  ["POST", "GET"], // formater hack
  null,
  { id: isDigit }
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

  const { cookies, method, query } = req;

  const id = parseInt(query.id as string);

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
      imageBlob = await ImageHelper.fetchImgById(user2.ppImage.imageId);
    } catch (e: any) {
      let code = HttpCodes.NOT_FOUND;
      res.status(code).json({
        isError: true,
        status: code,
        message: "Image not found\n" + e.message || "",
      });
      return;
    }

    res.setHeader("Content-Type", "image/jpg");
    // HACK but hey it works
    res.end(Buffer.from(await imageBlob.arrayBuffer()));
  }

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

  // FIXME
  let response = await ImageHelper.postBlob(imageBlob,"/api/image")

  let { data } = await response.json();

  let filename = data.split(".")[0];

  try {
    // HACK deleteMany so no need to check if image exists
    await prisma.ppImage.deleteMany({
      where: {
        userId: id,
      },
    });

    await prisma.image.create({
      data: {
        id: filename,
        userId: user,
      },
    });

    await prisma.ppImage.create({
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
