import cookieWrapper from "@/helper/cookiewrapper";
import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/helper/instances";

const DEFAULT_N = 20;

// TODO maybe remove the author id in the request
export default async function postList(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | { error: string }>
) {
  res.setHeader("Allow", ["GET"]);

  const { method, query } = req;
  const n = query.n ? parseInt(query.n as string) : DEFAULT_N;

  if (method != "GET") {
    res.status(405).json({ error: `Method ${method} Not Allowed` });
    return;
  }

  if (!cookieWrapper.isConnected(req.cookies)) {
    res.status(403).json({ error: "Not connected" });
    return;
  }

  let p = await prisma.post.findMany({
    take: n,
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!p) {
    res.status(404).json({ error: "No Posts in Database" });
    return;
  }

  res.status(201).json(p);
}
