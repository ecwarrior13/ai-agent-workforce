import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { logger } from '@/utils/logger'

export async function createClient() {
    const cookieStore = await cookies()
    // Create a server's supabase client with newly configured cookie,
    // which could be used to maintain user's session
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch (error) {
                        // Log the error but don't throw to prevent breaking the auth flow
                        logger.error('Failed to set cookies:', error)
                    }
                },
            },
        }
    )
}