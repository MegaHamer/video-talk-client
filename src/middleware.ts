import { NextResponse, type NextRequest } from "next/server";

export default function middeleware(request: NextRequest) {
  const { url, cookies } = request;
  const session = cookies.get("pga4_session")?.value;

  const isAuthPage = url.includes("/auth");

  if (isAuthPage) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard/settings", url));
    }
    return NextResponse.next();
  }
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", url));
  }
}
export const config = {
  matcher: ["/auth/:path*"],
};
