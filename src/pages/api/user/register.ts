import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../(helper)";

type Data = {
  msg?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query, method } = req;
  res.setHeader("Allow", ["POST"]);

  if (method != "POST") {
    res.status(405).json({ error: `Method ${method} Not Allowed` });
    return;
  }

  if (!(query.password && query.email && query.username)) {
    res.status(400).json({ error: "need a password, an email and a name" });
    return;
  }

  let old = await prisma.user.findUnique({
    where: {
      email: query.email as string,
    },
  });

  if (old) {
    res.status(403).end("email already used");
    return;
  }

  let u = await prisma.user.create({
    data: {
      email: query.email as string,
      username: query.username as string,
      password: query.password as string,
    },
  });

  res.status(201).json({ msg: `User ${u.username} with id ${u.id} was created !` });
}
