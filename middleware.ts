import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "./src/core/better-auth/auth";

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

	// セッションクッキーがない場合はそのまま処理を続ける
	if (!sessionCookie) {
		return NextResponse.next();
	}

	try {
		// better-auth でセッションを検証
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		// セッションが有効な場合はカスタムヘッダーを追加
		const response = NextResponse.next();
		if (session?.session) {
			response.headers.set("x-user-session", "valid");
		}

		return response;
	} catch (_error) {
		// セッション検証に失敗した場合はそのまま処理を続ける
		return NextResponse.next();
	}
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/equipment/:path*",
		"/maintenance/:path*",
		"/reports/:path*",
		"/documents/:path*"
	],
};