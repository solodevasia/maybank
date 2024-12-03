import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 2,
    path: "/",
  });
  res.setHeader("Set-Cookie", cookie);
  res.status(200).json("OK");
}
