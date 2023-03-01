export const APILINK = "/api";
export const USERAPI = APILINK + "/user";
export const POSTAPI = APILINK + "/post";
export const IMAGEAPI = APILINK + "/image";
export const UPLOADFOLDER = "./public/uploads";

export const MAXIMGSIZE = 11 * 1024 * 1024; // 11 MB
export const IMGEXT = ["jpeg", "png", "gif", "jpg"];

export interface OKApiResponse<T> {
  message: string;
  status: number;
  data: T;
  isError: false;
}
export interface ErrorApiResponse {
  message: string;
  status: number;
  data?: null;
  isError: true;
}

export type ApiResponse<T> = OKApiResponse<T> | ErrorApiResponse;

export enum HttpCodes {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  WRONG_METHOD = 405,
  INTERNAL_ERROR = 500,
}

export const conditions: { [key: string]: (s: any) => boolean } = {
  username: (s) => typeof s === "string" && s.length <= 20 && s.length > 0,
  email: (s) => typeof s === "string" && s.length <= 256 && s.length > 0,
  password: (s) => typeof s === "string" && s.length > 3,
  bio: (s) => typeof s === "string" && s.length <= 256,
};

export const defaultAvatarUrl = "/avatar.jpg";
