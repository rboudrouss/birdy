import { User } from "@/helper/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../(helper)";

export default async function userAll(
  req: NextApiRequest,
  res: NextApiResponse<User[] | { error: string }>
) {
  res.setHeader("Allow", ["GET"]);

  const { method } = req;

  let u = await prisma.user.findMany();

  if (method == "GET") {
    res.status(200).json(u);
    return;
  }

  res.status(405).json({ error: `Method ${method} Not Allowed` });
}
