import { type NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'
import { protectedRoutes, publicRoutes } from './config/routes'

export async function middleware(request: NextRequest) {
    try {
        const response = await updateSession(request)
        const { pathname } = request.nextUrl

        // Handle API routes
        if (pathname.startsWith('/api')) {
            const isProtectedApi = pathname.startsWith('/api/protected')
            if (isProtectedApi && !response.headers.get('x-supabase-auth')) {
                return new Response('Unauthorized', { status: 401 })
            }
            return response
        }

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

        // Add security headers
        const headers = new Headers(response.headers)
        headers.set('X-Frame-Options', 'DENY')
        headers.set('X-Content-Type-Options', 'nosniff')
        headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers
        })

    } catch (error) {
        console.error('Middleware error:', error)
        // Return a generic error response
        return new Response('Internal Server Error', { status: 500 })
    }
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