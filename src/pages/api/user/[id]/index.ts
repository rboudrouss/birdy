import { User } from "@/helper/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/helper/instances";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse<User | { error: string }>
) {
  res.setHeader("Allow", ["GET", "PUT"]);

  const { query, method } = req;
  const id = parseInt(query.id as string, 10);

  let u = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      posts: true,
      followers: true,
      following: true,
    },
  });

  if (!u) {
    res.status(404).json({ error: "User Not Found" });
    return;
  }

  if (method == "GET") {
    const { id, email, username, bio } = u;
    res.status(200).json({ id, email, username, bio });
    return;
  }

  if (method == "PUT") {
    let u2 = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email: (query.email as string) ?? u.email,
        username: (query.username as string) ?? u.username,
        password: (query.password as string) ?? u.password,
        bio: (query.bio as string) ?? u.bio,
      },
    });

    res.status(200).json(u2);
    return;
  }

  res.status(405).json({ error: `Method ${method} Not Allowed` });
}
