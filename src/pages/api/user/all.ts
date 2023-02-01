import { prisma } from "@/helper/instances";
import { User } from "@/helper/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function userAll(
  req: NextApiRequest,
  res: NextApiResponse<User[] | { error: string }>
) {
  res.setHeader("Allow", ["GET"]);

  const { method } = req;

  try {
    var u = await prisma.user.findMany();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }

  if (method == "GET") {
    res.status(200).json(u);
    return;
  }

  res.status(405).json({ error: `Method ${method} Not Allowed` });
}
