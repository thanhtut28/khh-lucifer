import { auth } from "~/server/auth";

export default auth((req) => {
  console.log("request", req.auth);
  if (!req.auth && req.nextUrl.pathname !== "/login") {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|server|_next/static|_next/image|favicon.ico).*)"],
};
