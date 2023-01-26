import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../(helper)";

type Data = {
  msg: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { query, method } = req;
  if (method != "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
    return;
  }

  if (!(query.password && query.email && query.name)){
    res.status(400).end("need a password, an email and a name")
    return;
  }

  try {
    var u = await prisma.user.create({
      data: {
        email: query.email as string,
        name: query.name as string,
        password: query.password as string
      }
    });
  } catch (error) {
    res.status(500).end(error);
    return;
  }

  res.status(201).json({ msg: `User ${u.name} with id ${u.id} was created !` });
}
