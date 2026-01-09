import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// const publicRoutes = ["/signin", "/register"];

export function middleware(_request: NextRequest) {
  // For now, skip middleware auth checks since we're using client-side auth
  // The client will handle redirects based on auth state
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip internal paths and static files
    "/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
