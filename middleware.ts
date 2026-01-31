
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protect /officer route
    if (request.nextUrl.pathname.startsWith('/officer')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check if user has 'official' or 'admin' role
        const { data: userData, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single()

        const isOfficial = userData?.role === 'official' || userData?.role === 'admin';

        if (error || !isOfficial) {
            // Redirect unauthorized users to home or a specific unauthorized page
            return NextResponse.redirect(new URL('/', request.url)) // Or /unauthorized
        }
    }

    // Protect /profile route
    if (request.nextUrl.pathname.startsWith('/profile') && !user) {
        // For profile, we might want to allow anon access or redirect
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
