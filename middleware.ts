import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pass through all requests - no auth checks
  return NextResponse.next();
}

export const config = {
  matcher: [], // Empty matcher = no routes protected
};
