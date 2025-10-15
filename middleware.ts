import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Minimal middleware for Netlify deployment
export function middleware(request: NextRequest) {
  // Simply pass through all requests without any authentication checks
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};