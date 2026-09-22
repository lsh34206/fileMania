import { Request, Response, NextFunction } from "express";

const EXEMPT_PATHS = new Set(["/login_ok", "/singup_ok"]);
const GUARDED_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * 쿠키 기반 인증 + CORS 화이트리스트 조합에서 사용하는 경량 CSRF 방어.
 * 일반 폼 전송이나 타 출처 fetch/XHR는 이 커스텀 헤더를 실어보낼 수 없으므로,
 * 헤더가 없는 상태변경 요청(POST/PUT/PATCH/DELETE)은 차단한다.
 */
export function csrfGuard(req: Request, res: Response, next: NextFunction) {
    if (!GUARDED_METHODS.has(req.method) || EXEMPT_PATHS.has(req.path)) {
        return next();
    }

    if (req.headers["x-requested-with"] !== "XMLHttpRequest") {
        return res.status(403).json({ success: false, message: "잘못된 요청입니다." });
    }

    return next();
}
