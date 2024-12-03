import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/register", "/"];
const protectedRoutes = ["/dashboard"];

export default async function middleware(request: NextRequest) {
  const resp = NextResponse;
  const path = request.nextUrl.pathname;
  if (!Boolean(/_next|favicon/.test(path))) {
    const isProtectedRoutes = protectedRoutes.includes(path);
    const isPublicRoutes = publicRoutes.includes(path);

    const cookie = await cookies();

    const data = await fetch("http://localhost:4000/api/v1/user/profile", {
      method: "GET",
      headers: { Authorization: `Bearer ${cookie.get("token")?.value}` },
    }).then(async (respData) => await respData.json());

    if (data.statusCode >= 201) {
      cookie.delete("token");
    }

    if (!cookie.get("token")?.value && isProtectedRoutes) {
      return resp.redirect(new URL("/", request.nextUrl));
    }

    if (cookie.get("token")?.value && isPublicRoutes) {
      
      return resp.redirect(new URL("/dashboard", request.nextUrl));
    }
  }
}
