import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../(helper)";

type Data = {
  msg?: string;
  error?: string;
  user?: User;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body, method } = req;
  res.setHeader("Allow", ["POST"]);

  if (method != "POST") {
    res.status(405).json({ error: `Method ${method} Not Allowed` });
    return;
  }

  if (!(body.password && body.email && body.username)) {
    res.status(400).json({ error: "need a password, an email and a name" });
    return;
  }

  let old = await prisma.user.findUnique({
    where: {
      email: body.email as string,
    },
  });

  if (old) {
    res.status(403).json({ error: "email already used" });
    return;
  }

  let u = await prisma.user.create({
    data: {
      email: body.email as string,
      username: body.username as string,
      password: body.password as string,
      bio: (body.bio as string | undefined) ?? null,
    },
  });

  res
    .status(201)
    .json({ msg: `User ${u.username} with id ${u.id} was created !`, user: u });
}
