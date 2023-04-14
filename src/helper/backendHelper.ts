import type { NextApiRequest, NextApiResponse } from "next";

import { Post, PrismaClient } from "@prisma/client";
import { ApiResponse, HttpCodes, sessionTTL } from "./constants";
import { randomBytes } from "crypto";

export const prisma = new PrismaClient();

// 5 first bytes are random, 11 next bytes are the expiration date in hex, last bytes are the user id in hex
export function generateSession(id: number) {
  return `${randomBytes(5).toString("hex").padStart(5, "0")}${(
    Date.now() + sessionTTL
  ).toString(16)}${id.toString(16)}`;
}

export function sessionExpired(session?: string | null): boolean {
  if (!session) return true;

  try {
    const exp = parseInt(session.slice(6, 17), 16);
    return Date.now() > exp;
  } catch {
    return true;
  }
}

// Return null if session not found
export async function findConnectedUser(
  session: string | undefined | null
): Promise<number | null> {
  if (!session) return null;
  if (sessionExpired(session)) return null;

  // findMany so no error if session not found
  return (
    (
      await prisma.session.findMany({
        where: {
          id: session,
        },
      })
    )[0]?.userId ?? null
  );
}

// from string
export function isDigit(a: any): boolean {
  if (typeof a !== "string") return false;

  if (a.split("").some((e) => e < "0" || e > "9")) return false;

  // HACK this might be redundant but hey
  if (isNaN(parseInt(a))) return false;

  return true;
}

// use with a include
export const allPostInfoPrisma = {
  author: {
    include: {
      ppImage: true,
    },
  },
  likes: {
    include: {
      user: {
        include: {
          ppImage: true,
        },
      },
    },
  },
  images: true,
};

export function sanitizeSearch(search: string) {
  return search.replace(/[^a-zA-Z0-9 ]/g, "");
}

// prisma doesn't support sqlite full text search, so we have to do it ourselves
export async function textSearch(text: string) {
  const words = sanitizeSearch(text)
    .split(" ")
    .map((e) => `%${e}%`)
    .filter((e) => e.length > 0);
  let conditions = words.map((word) => `content LIKE '${word}'`).join(" AND ");
  return await prisma.$queryRawUnsafe<Post[]>(
    `SELECT * FROM "Post" WHERE ${conditions}`
  );
}

type verifyQueryT = (x: string | string[] | undefined) => boolean;
type verifyBodyT = (x: any) => boolean;

export function verifyBody(
  body: any,
  bodyAttr?: { [key: string]: boolean | verifyBodyT } | null
) {
  if (!bodyAttr) return true;

  return Object.keys(bodyAttr)
    .map(
      (att) =>
        (bodyAttr[att] === false || body[att]) &&
        (typeof bodyAttr[att] === "boolean"
          ? true
          : (bodyAttr[att] as verifyBodyT)(body[att]))
    )
    .every((e) => e);
}

export function verifyQuery(
  query: { [key: string]: string | string[] | undefined },
  queryAttr?: { [key: string]: boolean | verifyQueryT } | null
) {
  if (!queryAttr) return true;

  return Object.keys(queryAttr)
    .map(
      (att) =>
        (queryAttr[att] === false || query[att]) &&
        (typeof queryAttr[att] === "boolean"
          ? true
          : (queryAttr[att] as verifyQueryT)(query[att]))
    )
    .every((e) => e);
}

export function verify(
  body: any,
  query: { [key: string]: string | string[] | undefined },
  bodyAttr?: { [key: string]: boolean | verifyBodyT } | null,
  queryAttr?: { [key: string]: boolean | verifyQueryT } | null
) {
  return verifyBody(body, bodyAttr) && verifyQuery(query, queryAttr);
}

export function APIdecorator<T>(
  target: (req: NextApiRequest, res: NextApiResponse<ApiResponse<T>>) => void,
  allowedMethod?: string[],
  bodyAttr?: { [key: string]: boolean | verifyBodyT } | null,
  queryAttr?: { [key: string]: boolean | verifyQueryT } | null
) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse<ApiResponse<T>>
  ) {
    if (allowedMethod) res.setHeader("Allow", allowedMethod);

    const { method, body, query, cookies } = req;

    if (allowedMethod && (!method || !allowedMethod.includes(method))) {
      let code = HttpCodes.WRONG_METHOD;
      res.status(code).json({
        isError: true,
        status: code,
        message: `Method ${method} Not Allowed`,
      });
      return;
    }

    console.log("\n\n", req.url);
    console.log("body", body);
    console.log("query", query);
    console.log("cookies", cookies);

    // HACK un peu moche la fonction
    if (bodyAttr && !verifyBody(body, bodyAttr)) {
      let code = HttpCodes.BAD_REQUEST;
      res.status(code).json({
        isError: true,
        status: code,
        message: `Attributes not found or incorrect (needed body attributes : ${Object.keys(
          bodyAttr
        ).join(", ")})`,
      });
      return;
    }

    if (queryAttr && !verifyQuery(query, queryAttr)) {
      let code = HttpCodes.BAD_REQUEST;
      res.status(code).json({
        isError: true,
        status: code,
        message: `Important Attribute not found or incorrect`,
      });
      return;
    }

    target(req, res);
    return;
  };
}
