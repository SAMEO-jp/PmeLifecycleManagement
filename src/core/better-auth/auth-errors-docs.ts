/**
 * Better Authのエラーハンドリング機能についてのドキュメント
 * 
 * Better Authは、エラーの原因を特定するための包括的なエラーハンドリング機能を提供します。
 */

import { authClient } from "./auth-client";

/**
 * ============================================
 * クライアント側のエラーハンドリング
 * ============================================
 * 
 * Better Authのクライアント関数は、エラーが発生した場合に以下のプロパティを持つ
 * エラーオブジェクトを返します：
 * 
 * - `message`: エラーメッセージ（例：「Invalid email or password」）
 * - `status`: HTTPステータスコード（例：401, 400, 500）
 * - `statusText`: HTTPステータステキスト（例：「Unauthorized」）
 * - `code`: エラーコード（存在する場合）
 * 
 * 【基本的な使用方法】
 * 
 * ```typescript
 * const { data, error } = await authClient.signIn.email({
 *     email: "user@example.com",
 *     password: "password123"
 * });
 * 
 * if (error) {
 *     console.error("エラーコード:", error.code);
 *     console.error("エラーメッセージ:", error.message);
 *     console.error("HTTPステータス:", error.status);
 * }
 * ```
 * 
 * 【onErrorコールバックを使用する方法】
 * 
 * ```typescript
 * await authClient.signIn.email({
 *     email: "user@example.com",
 *     password: "password123"
 * }, {
 *     onError: (ctx) => {
 *         console.error("エラー詳細:", ctx.error);
 *         // ctx.error.message, ctx.error.code, ctx.error.status などが利用可能
 *     }
 * });
 * ```
 * 
 * 【fetchOptionsを使用した高度なエラーハンドリング】
 * 
 * ```typescript
 * await authClient.signIn.email({
 *     email: "user@example.com",
 *     password: "password123"
 * }, {
 *     fetchOptions: {
 *         onError: async (context) => {
 *             const { error, response } = context;
 *             
 *             // レート制限エラーの場合
 *             if (response?.status === 429) {
 *                 const retryAfter = response.headers.get("X-Retry-After");
 *                 console.log(`${retryAfter}秒後に再試行可能`);
 *             }
 *             
 *             // エラーコードによる処理分岐
 *             if (error.code === "USER_NOT_FOUND") {
 *                 // ユーザーが見つからない場合の処理
 *             }
 *         }
 *     }
 * });
 * ```
 * 
 * 【エラーコードの取得】
 * 
 * Better Authは、`authClient.$ERROR_CODES`オブジェクトにすべてのエラーコードを
 * 含んでいます。これを使用してエラーの翻訳やカスタムメッセージを実装できます。
 * 
 * ```typescript
 * // エラーコードの一覧を取得
 * const errorCodes = authClient.$ERROR_CODES;
 * 
 * // エラーコードを使って翻訳
 * const errorMessages: Record<string, string> = {
 *     USER_ALREADY_EXISTS: "このメールアドレスは既に登録されています",
 *     INVALID_EMAIL_OR_PASSWORD: "メールアドレスまたはパスワードが正しくありません",
 *     // ...
 * };
 * ```
 * 
 * ============================================
 * サーバー側のエラーハンドリング
 * ============================================
 * 
 * サーバー側でAPIエンドポイントを呼び出す場合、エラーは例外としてスローされます。
 * エラーは`APIError`のインスタンスです。
 * 
 * ```typescript
 * import { APIError } from "better-auth/api";
 * import { auth } from "@/core/better-auth/auth";
 * 
 * try {
 *     await auth.api.signInEmail({
 *         body: {
 *             email: "user@example.com",
 *             password: "password123"
 *         }
 *     });
 * } catch (error) {
 *     if (error instanceof APIError) {
 *         console.error("エラーメッセージ:", error.message);
 *         console.error("HTTPステータス:", error.status);
 *         // error.code も利用可能（存在する場合）
 *     }
 * }
 * ```
 * 
 * 【サーバー側でのグローバルなエラーハンドリング設定】
 * 
 * `auth.ts`で`onAPIError`オプションを使用して、グローバルなエラーハンドリングを
 * 設定できます：
 * 
 * ```typescript
 * export const auth = betterAuth({
 *     // ...他の設定
 *     onAPIError: {
 *         throw: false, // エラーをスローしない（デフォルト: false）
 *         onError: (error, ctx) => {
 *             // カスタムエラーハンドリング
 *             console.error("認証エラー:", {
 *                 message: error.message,
 *                 status: error.status,
 *                 code: error.code,
 *                 path: ctx.path
 *             });
 *             
 *             // エラーログを外部サービスに送信するなど
 *             // sendErrorToLoggingService(error);
 *         },
 *         errorURL: "/auth/error" // エラー時のリダイレクト先
 *     }
 * });
 * ```
 * 
 * ============================================
 * 主なエラーコード（推測）
 * ============================================
 * 
 * Better Authで使用される可能性のあるエラーコード：
 * 
 * - `USER_ALREADY_EXISTS`: ユーザーが既に存在する
 * - `USER_NOT_FOUND`: ユーザーが見つからない
 * - `INVALID_EMAIL_OR_PASSWORD`: メールアドレスまたはパスワードが無効
 * - `INVALID_TOKEN`: トークンが無効
 * - `TOKEN_EXPIRED`: トークンの有効期限が切れている
 * - `SESSION_EXPIRED`: セッションの有効期限が切れている
 * - `EMAIL_REQUIRED`: メールアドレスが必要
 * - `PASSWORD_REQUIRED`: パスワードが必要
 * - `PASSWORD_TOO_SHORT`: パスワードが短すぎる
 * - `RATE_LIMIT_EXCEEDED`: レート制限を超過
 * 
 * 注意: 実際のエラーコードは、Better Authのバージョンや使用している
 * プラグインによって異なる場合があります。`authClient.$ERROR_CODES`を
 * 確認して、利用可能なエラーコードを確認してください。
 */

// このファイルはドキュメント用です。実際のエラーハンドリング機能は
// `auth-errors.ts`と`auth-error-example.tsx`を参照してください。

export {};

