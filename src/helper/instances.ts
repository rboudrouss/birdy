import type { NextApiRequest, NextApiResponse } from "next";

// Return true if request is correct else false
export function checkValidReq<T>(
  req: NextApiRequest,
  res: NextApiResponse<T | { error: string }>,
  allowedMethod: string[],
  requiredAttr?: string[]
): boolean {
  res.setHeader("Allow", allowedMethod);

  const { method, body } = req;

  if (!method || !allowedMethod.includes(method)) {
    res.status(405).json({ error: `Method ${method} Not Allowed` });
    return false;
  }

  if (requiredAttr && !requiredAttr.map((att) => body[att]).every((e) => e)) {
    res.status(400).json({
      error: `need at least these attributes: ${requiredAttr.join(", ")}`,
    });
    return false;
  }

  return true;
}
