import { prisma } from "@/helper/instances";
import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  msg?: string;
  error?: string;
  user?: User;
};

export default async function registerHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.setHeader("Allow", ["POST"]);

  const { body, method } = req;

  if (method != "POST") {
    res.status(405).json({ error: `Method ${method} Not Allowed` });
    return;
  }

  if (!(body.password && body.email && body.username)) {
    res.status(400).json({ error: "need a password, an email and a name" });
    return;
  }

  try {
    var old = await prisma.user.findUnique({
      where: {
        email: body.email as string,
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }

  if (old) {
    res.status(403).json({ error: "email already used" });
    return;
  }

  try {
    var u = await prisma.user.create({
      data: {
        email: body.email as string,
        username: body.username as string,
        password: body.password as string,
        bio: (body.bio as string | undefined) ?? null,
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
    return;
  }

  res
    .status(201)
    .json({ msg: `User ${u.username} with id ${u.id} was created !`, user: u });
}
