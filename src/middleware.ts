import { NextResponse, type NextRequest } from "next/server";

export default function middeleware(request: NextRequest) {
  const { url, cookies, nextUrl } = request;
  const session = cookies.get("session")?.value;

  const isAuthPage = url.includes("/auth");
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
