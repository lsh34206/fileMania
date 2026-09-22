import * as cookieSignature from "cookie-signature";

const FALLBACK_SECRET = "filemania-dev-secret-change-me";

if (!process.env.COOKIE_SECRET) {
    console.warn("[cookieAuth] COOKIE_SECRET가 설정되지 않아 임시 기본값을 사용합니다. .env에 COOKIE_SECRET을 설정해주세요.");
}

export const COOKIE_SECRET = process.env.COOKIE_SECRET ?? FALLBACK_SECRET;

/**
 * socket.io의 handshake 쿠키 헤더에서 cookie-parser가 서명한 `user` 쿠키 값을 검증하여 추출한다.
 * 서명이 없거나 위조된 경우 null을 반환한다 (Express 쪽의 req.signedCookies.user와 동일한 신뢰 수준).
 */
export function unsignUserCookie(cookieHeader?: string | null): string | null {
    if (!cookieHeader) {
        return null;
    }

    const match = cookieHeader
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("user="));
    if (!match) {
        return null;
    }

    const raw = decodeURIComponent(match.slice("user=".length));
    const value = raw.startsWith("s:") ? raw.slice(2) : raw;

    const unsigned = cookieSignature.unsign(value, COOKIE_SECRET);
    return unsigned === false ? null : unsigned;
}
