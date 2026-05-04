import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic =
    pathname.startsWith('/auth') ||
    pathname.startsWith('/catalog') ||
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'

  const hasSession =
    request.cookies.has('sb-access-token') ||
    request.cookies.has('sb-refresh-token') ||
    [...request.cookies.getAll()].some(c => c.name.includes('auth-token'))

  if (!hasSession && !isPublic) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
