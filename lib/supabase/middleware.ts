import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected Routes Logic
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // allow login page (moved to root)
        // if (request.nextUrl.pathname === '/login') { ... } 
        // Logic handled by main flow now since /login is not under /admin
        // But we need to ensure /admin redirects to /login

        // Checking if user is logged in for other admin routes
        if (!user) {
            const redirectRes = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.getAll().forEach(c => redirectRes.cookies.set(c.name, c.value));
            return redirectRes;
        }
    }

    return response;
}
