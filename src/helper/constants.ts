export const APILINK = "/api";
export const USERAPI = APILINK + "/user";
export const POSTAPI = APILINK + "/post";

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
  BAD_REQ = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  WRONG_METHOD = 405,
  INTERNAL_ERROR = 500,
}

// TODO don't know where to put this so it's here for the moment
export function isDigit(a: any): boolean {
  if(typeof a !== "string") return false;

  if (a.split("").some((e) => e < "0" || e > "9")) return false;

  // HACK this might be redundant but hey
  if (isNaN(parseInt(a))) return false;

  return true;
}
