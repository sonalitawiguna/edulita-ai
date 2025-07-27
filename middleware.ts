import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // For now, we'll use a simple middleware without Supabase auth helpers
  // This avoids the environment variable error during development

  // Allow all requests to pass through
  // In production, you would implement proper auth checks here
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
