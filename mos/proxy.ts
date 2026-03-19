import { NextRequest } from "next/server";
import { authUser } from "./lib/auth";

export async function proxy(req: NextRequest) {
  console.log("req safly passed from ", req.url);

  //call a function for checking if user is authenticated
  //send the req to this function and let it do the rest then if it authed then return this and let the config do its job
  return authUser(req);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
    "/register",
    // "/auth/signout",
  ],
};
