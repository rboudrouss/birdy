import { prisma } from "@/helper/instances";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  msg?: string;
  error?: string;
};

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.setHeader("Allow", ["POST"]);

  const { method, body } = req;

  if (method != "POST") {
    res.status(405).json({ error: `Method ${method} Not Allowed` });
    return;
  }

  if (!(body.password && body.email)) {
    res.status(400).json({ error: "need a password and an email" });
    return;
  }

  let u = await prisma.user.findUnique({
    where: {
      email: body.email as string,
    },
  });

  if (!u || body.password !== u.password) {
    res.status(403).json({ error: "Wrong email or password" });
    return;
  }

  res.status(202).json({ ...u, msg: `Welcome ${u.username} (id:${u.id})` });
}
