import createMiddleware from "next-intl/middleware";
import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function readLocale(pathname: string) {
    const [, maybeLocale] = pathname.split("/");
    const locale = maybeLocale as (typeof routing.locales)[number];

    return routing.locales.includes(locale) ? locale : routing.defaultLocale;
}

function isProtectedPath(pathname: string) {
    return /^\/(en|ar)\/dashboard(?:\/.*)?$/.test(pathname);
}

function isAuthPath(pathname: string) {
    return /^\/(en|ar)\/auth\/(signin|signup)$/.test(pathname);
}

export default async function proxy(request: NextRequest) {
    const response = intlMiddleware(request);
    const pathname = request.nextUrl.pathname;
    const locale = readLocale(pathname);
    const hasSessionCookie = Boolean(getSessionCookie(request));

    if (isProtectedPath(pathname) && !hasSessionCookie) {
        return NextResponse.redirect(
            new URL(`/${locale}/auth/signin`, request.url),
        );
    }

    if (isAuthPath(pathname) && hasSessionCookie) {
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        if (session) {
            return NextResponse.redirect(
                new URL(`/${locale}/dashboard`, request.url),
            );
        }
    }

    return response;
}

export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
