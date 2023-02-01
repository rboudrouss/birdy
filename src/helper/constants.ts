import { PrismaClient } from "@prisma/client";

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

export const prisma = new PrismaClient();

// TODO add relations
// export interface User {
//   id?: number;
//   email: string;
//   password?: string;
//   username: string;
//   bio?: String | null;
//   posts?: Post[];
//   followers?: { followerId: number; followingId: number }[];
//   following?: { followerId: number; followingId: number }[];
//   link?: string; // TODO implement this
// }

// export interface Post {
//   id: number;
//   createdAt: Date;
//   content: string;
//   authorId: number;
//   replyId?: number;
//   link?: string;
// }
