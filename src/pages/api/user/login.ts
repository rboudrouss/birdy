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

  if (!(query.password && query.email)) {
    res.status(400).end("need a password and an email");
    return;
  }

  try {
    var u = await prisma.user.findUnique({
      where: {
        email: query.email as string,
      },
    });
  } catch (error) {
    res.status(500).end(error);
    return;
  }

  if (!u || query.password !== u.password) {
    res.status(403).end("Wrong email or password");
    return;
  }

  res.status(202).json({ msg: `Welcome ${u.name} (id:${u.id})` });
}
