import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await fetch("http://localhost:4000/api/v1/user/login/access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req.body),
  }).then(async (res) => await res.json());
  if (result.accessToken) {
    const cookie = serialize("token", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 2,
      path: "/",
    });
    res.setHeader("Set-Cookie", cookie);
  }
  res.status(result.status).json(result);
}
