import { type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'
import { protectedRoutes, publicRoutes } from './config/routes'

export async function middleware(request: NextRequest) {
    const response = await updateSession(request)
    const { pathname } = request.nextUrl

    // Skip middleware for public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return response
    }

    // Check if the route requires authentication
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    )

    // If it's a protected route and there's no session, redirect to sign-in
    if (isProtectedRoute && !response.headers.get('x-supabase-auth')) {
        const redirectUrl = new URL('/sign-in', request.url)
        redirectUrl.searchParams.set('redirectedFrom', pathname)
        return Response.redirect(redirectUrl)
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public assets
         * - api routes (handled separately)
         */
        '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}