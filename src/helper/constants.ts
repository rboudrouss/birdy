export const APILINK = "/api";
export const USERAPI = APILINK + "/user";
export const POSTAPI = APILINK + "/post";

export interface OKApiResponse<T> {
  data: T;
  isError: false;
}
export interface ErrorApiResponse {
  data?: null;
  isError: true;
}

export type ApiResponse<T> = { message: string; status: number } & (
  | OKApiResponse<T>
  | ErrorApiResponse
);

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
