import { Post, User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, conditions, HttpCodes } from "@/helper/constants";
import {
  APIdecorator,
  sanitizeSearch,
  textSearch,
  userSearch,
} from "@/helper/backendHelper";

const APIPostList = APIdecorator(
  postList,
  ["GET"],
  null, // formater hack
  {
    s: conditions.searchText,
  }
);
export default APIPostList;

export async function postList(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<{users: User[], posts:Post[]}>>
) {
  const { query } = req;
  let searchText = query.s as string;
  searchText = sanitizeSearch(searchText);

  if (!searchText) {
    res.status(HttpCodes.BAD_REQUEST).json({
      message: "Invalid search text",
      status: HttpCodes.BAD_REQUEST,
      isError: true,
    });
    return;
  }

  try {
    var p = await textSearch(searchText);
    var u = await userSearch(searchText);
  } catch (e: any) {
    res.status(HttpCodes.INTERNAL_ERROR).json({
      message: e.message,
      status: HttpCodes.INTERNAL_ERROR,
      isError: true,
    });
    return;
  }

  res.status(HttpCodes.OK).json({
    message: "OK",
    status: HttpCodes.OK,
    isError: false,
    data: {
      users: u,
      posts: p,
    }
  });
}