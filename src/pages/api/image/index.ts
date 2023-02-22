import { ApiResponse, HttpCodes, isDigit } from "@/helper/constants";
import cookieWrapper from "@/helper/cookiewrapper";
import { APIdecorator, findConnectedUser } from "@/helper/backendHelper";
import { NextApiRequest, NextApiResponse } from "next";

const APIimageHandler = APIdecorator(
  imageHandler,
  ["POST"], // formater hack
  { id: isDigit } // IN QUERY <!> not in body
);

export default APIimageHandler;

async function imageHandler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<string>>
) {
  if (req.headers["content-type"] !== "image/jpeg") {
    let code = HttpCodes.BAD_REQ;
    res.status(code).json({
      isError: true,
      status: code,
      message: "Accept only jpeg images",
    });
    return;
  }

  const { query, cookies } = req;

  const id = parseInt(query.id as string);

  if ((await findConnectedUser(cookies.session)) !== id) {
    let code = HttpCodes.FORBIDDEN;
    res.status(code).json({
      isError: true,
      status: code,
      message: "wrong cookie, wrong account",
    });
    return;
  }
}
