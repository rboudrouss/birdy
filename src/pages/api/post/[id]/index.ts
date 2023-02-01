import { Post } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/helper/instances";

// TODO maybe remove the author id in the request
export default async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse<Post | { error: string }>
) {
  res.setHeader("Allow", ["GET"]);

  const { method, query } = req;

  if (method != "GET") {
    res.status(405).json({ error: `Method ${method} Not Allowed` });
    return;
  }

  try {
    var p = await prisma.post.findUnique({
      where: {
        id: parseInt(query.id as string),
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }

  if (!p) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.status(201).json(p);
}
