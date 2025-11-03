/**
 * Better Authのエラーハンドリングユーティリティ
 */


/**
 * エラーメッセージの日本語翻訳マップ
 */
const errorMessages: Record<string, string> = {
  // 認証エラー
  INVALID_EMAIL_OR_PASSWORD: "メールアドレスまたはパスワードが正しくありません",
  USER_ALREADY_EXISTS: "このメールアドレスは既に登録されています",
  USER_NOT_FOUND: "ユーザーが見つかりません",
  INVALID_TOKEN: "無効なトークンです",
  TOKEN_EXPIRED: "トークンの有効期限が切れています",
  SESSION_EXPIRED: "セッションの有効期限が切れています",
  
  // バリデーションエラー
  EMAIL_REQUIRED: "メールアドレスを入力してください",
  PASSWORD_REQUIRED: "パスワードを入力してください",
  PASSWORD_TOO_SHORT: "パスワードが短すぎます（最低8文字）",
  PASSWORD_TOO_LONG: "パスワードが長すぎます（最大128文字）",
  INVALID_EMAIL_FORMAT: "有効なメールアドレスを入力してください",
  
  // レート制限エラー
  RATE_LIMIT_EXCEEDED: "リクエスト回数が上限に達しました。しばらく待ってから再試行してください",
  
  // その他のエラー
  INTERNAL_SERVER_ERROR: "サーバーエラーが発生しました",
  BAD_REQUEST: "リクエストが無効です",
  UNAUTHORIZED: "認証が必要です",
  FORBIDDEN: "アクセス権限がありません",
};

/**
 * エラーコードから日本語メッセージを取得
 */
export function getErrorMessage(error: { code?: string; message?: string } | null | undefined): string {
  if (!error) {
    return "不明なエラーが発生しました";
  }

  // エラーコードが存在する場合、翻訳マップから取得
  if (error.code && errorMessages[error.code]) {
    return errorMessages[error.code];
  }

  // エラーメッセージが存在する場合、そのまま返す
  if (error.message) {
    return error.message;
  }

  return "不明なエラーが発生しました";
}

/**
 * エラーの詳細情報を取得
 */
export function getErrorDetails(error: { code?: string; message?: string; status?: number; statusText?: string } | null | undefined) {
  if (!error) {
    return null;
  }

  return {
    code: error.code || "UNKNOWN_ERROR",
    message: getErrorMessage(error),
    status: error.status,
    statusText: error.statusText,
  };
}

/**
 * エラーコードの一覧を取得（デバッグ用）
 */
export function getAvailableErrorCodes() {
  // authClient.$ERROR_CODESから取得可能
  // この関数は開発時にエラーコードを確認するために使用できます
  return Object.keys(errorMessages);
}

