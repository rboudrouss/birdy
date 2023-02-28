import type { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";
import { ApiResponse, HttpCodes } from "./constants";
export const prisma = new PrismaClient();

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
  allowedMethod?: string[] | null,
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
        message: `Attributes not found or incorect (needed body attributes : ${Object.keys(
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
        message: `Important Attribute not found or incorect`,
      });
      return;
    }

    target(req, res);
    return;
  };
}

// Return -1 if session not found
export async function findConnectedUser(
  session: string | undefined | null
): Promise<number> {
  if (!session) return -1;

  return (
    (
      await prisma.session.findUnique({
        where: {
          id: session,
        },
      })
    )?.userId ?? -1
  );
}

export function isDigit(a: any): boolean {
  if (typeof a !== "string") return false;

  if (a.split("").some((e) => e < "0" || e > "9")) return false;

  // HACK this might be redundant but hey
  if (isNaN(parseInt(a))) return false;

  return true;
}
