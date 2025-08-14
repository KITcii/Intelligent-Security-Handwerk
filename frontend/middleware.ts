export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/assistant/:path*", "/api/:path"],
};
