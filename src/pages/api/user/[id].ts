import { User } from "@/helper/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../(helper)";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse<User>
) {
  const { query, method } = req;
  const id = parseInt(query.id as string, 10);

  try {
    var u = await prisma.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    res.status(500).end(error);
    return;
  }

  if (!u) {
    res.status(404).end("User Not Found");
    return;
  }

  if (method == "GET") {
    const { id, email, name, bio } = u;
    res.status(200).json({ id, email, name, bio });
  } else if (method == "PUT") {
    try {
      var u2 = await prisma.user.update({
        where: {
          id,
        },
        data: {
          email: (query.email as string) ?? u.email,
          name: (query.name as string) ?? u.name,
          password: (query.password as string) ?? u.password,
          bio: (query.bio as string) ?? u.bio,
        },
      });
    } catch (error) {
      res.status(500).end(error);
      return;
    }

    res.status(200).json(u2);
    return;
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
