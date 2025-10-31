---
仕様書: 実績日報
実績日報の仕様書: true
仕様書No.: ""
日本語名: 12. セキュリティ考慮事項
---

# セキュリティ考慮事項

## 概要

実績日報入力システムでは、ユーザーの個人情報と業務データを保護するため、多層的なセキュリティ対策を実装します。すべての対策はOWASPガイドラインと業界標準に基づいています。

## 認証・認可

### JWT認証

- **トークン発行**: ログイン時に短期有効のJWTトークンを発行
- **トークン検証**: すべてのAPIリクエストでトークンの有効性を検証
- **リフレッシュトークン**: セッション維持のためのリフレッシュトークン机制
- **トークン失効**: ログアウト時またはセキュリティイベント発生時に即時失効

### 認可制御

```typescript
// 権限レベル定義
enum UserRole {
  ADMIN = 'admin',      // システム管理者
  MANAGER = 'manager',  // 部署管理者
  USER = 'user'         // 一般ユーザー
}

// リソースベースのアクセス制御
interface Permission {
  resource: string      // 'work-entries', 'categories'
  action: string        // 'create', 'read', 'update', 'delete'
  scope: string         // 'own', 'department', 'all'
}
```

### セッション管理

- **セッションタイムアウト**: 30分間の非アクティブで自動ログアウト
- **同時ログイン制限**: 同じアカウントの同時ログインを3セッションに制限
- **デバイス追跡**: ログインしたデバイス情報の記録と監視

## 入力検証とデータサニタイズ

### クライアント側検証

```typescript
// 入力データのサニタイズ関数
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')  // 基本的なXSS対策
    .trim()                // 不要な空白除去
    .substring(0, 1000)    // 長さ制限
}

// バリデーションスキーマ
const workEntrySchema = z.object({
  title: z.string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください')
    .regex(/^[^<>]*$/, '不正な文字が含まれています'),
  hours: z.number()
    .min(0.5, '作業時間は0.5時間以上で入力してください')
    .max(24, '作業時間は24時間以内で入力してください'),
  // ... その他のフィールド
})
```

### サーバー側検証

- **多層検証**: クライアント検証に加え、サーバー側でも完全な検証
- **型チェック**: TypeScriptによる静的型チェック
- **スキーマ検証**: Zodなどのスキーマ検証ライブラリ使用
- **サニタイズ**: HTMLエスケープ、SQLパラメータ化

## データ保護

### 通信セキュリティ

- **HTTPS強制**: すべての通信をHTTPSで暗号化
- **HSTS**: HTTP Strict Transport Securityヘッダーの設定
- **証明書ピニング**: SSL証明書のピンニング（モバイルアプリの場合）

### データ暗号化

```typescript
// 機密データの暗号化
const encryptSensitiveData = (data: string): string => {
  const algorithm = 'aes-256-gcm'
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32)
  const iv = crypto.randomBytes(16)

  const cipher = crypto.createCipher(algorithm, key)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return `${iv.toString('hex')}:${encrypted}:${cipher.getAuthTag().toString('hex')}`
}
```

### データベースセキュリティ

- **パラメータ化クエリ**: SQLインジェクション対策
- **最小権限の原則**: データベースユーザーには必要最小限の権限のみ付与
- **監査ログ**: データアクセス操作の完全なログ記録

## CSRF対策

### Double Submit Cookie Pattern

```typescript
// CSRFトークン生成
const generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

// ミドルウェアでの検証
const validateCsrfToken = (req: Request): boolean => {
  const tokenFromHeader = req.headers.get('x-csrf-token')
  const tokenFromCookie = req.cookies.get('csrf-token')

  return tokenFromHeader === tokenFromCookie
}
```

### SameSite Cookie属性

```typescript
// セキュアなCookie設定
const secureCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  maxAge: 3600,  // 1時間
  path: '/'
}
```

## XSS対策

### Content Security Policy (CSP)

```http
Content-Security-Policy: default-src 'self';
  script-src 'self' 'unsafe-inline' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com
```

### 出力エンコーディング

```typescript
// HTML出力時のエンコーディング
const encodeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
```

## レート制限とDoS対策

### APIレート制限

```typescript
// レート制限設定
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000,  // 15分
  max: 100,                  // 15分間に100リクエスト
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'リクエスト制限を超えました。しばらく待ってから再試行してください。'
  },
  standardHeaders: true,
  legacyHeaders: false,
}
```

### リクエストサイズ制限

- **JSONペイロード**: 1MB以下
- **ファイルアップロード**: 10MB以下
- **URL長**: 2048文字以下

## 監査とログ

### セキュリティイベントログ

```typescript
interface SecurityEvent {
  id: string
  timestamp: Date
  userId: string
  eventType: 'login' | 'logout' | 'failed_login' | 'permission_denied' | 'data_access'
  ipAddress: string
  userAgent: string
  resource?: string
  action?: string
  success: boolean
  details?: Record<string, any>
}
```

### ログレベルと保管

- **ERROR**: セキュリティ違反、システムエラー → 無期限保存
- **WARN**: 不審なアクセスパターン → 1年保存
- **INFO**: 正常なセキュリティイベント → 6ヶ月保存

## 脆弱性管理

### 定期的なセキュリティスキャン

- **依存関係チェック**: npm audit, Snykなどのツール使用
- **コード脆弱性スキャン**: ESLintセキュリティルール、SonarQube
- **コンテナ脆弱性スキャン**: Dockerイメージのセキュリティスキャン

### セキュリティアップデート

- **自動化された更新**: CI/CDパイプラインでの依存関係更新
- **変更影響評価**: 更新前のセキュリティ影響評価
- **ロールバック計画**: 問題発生時の迅速なロールバック

## インシデント対応

### インシデント対応計画

1. **検知**: セキュリティ監視システムによる自動検知
2. **評価**: インシデントの影響範囲と重大度の評価
3. **封じ込め**: 攻撃の拡大防止措置
4. **回復**: システムの安全な状態への復旧
5. **教訓**: インシデント分析と改善策の実施

### 連絡体制

- **セキュリティチーム**: 24/7体制での監視
- **緊急連絡網**: 関係者への迅速な通知システム
- **外部報告**: 必要に応じた当局への報告

## コンプライアンス

### データ保護規制対応

- **個人情報保護**: 個人情報保護法対応
- **GDPR**: EU一般データ保護規則対応（該当する場合）
- **業界標準**: ISO 27001準拠

### 定期的なセキュリティ評価

- **脆弱性評価**: 四半期ごとの脆弱性スキャン
- **ペネトレーションテスト**: 年1回の外部委託テスト
- **セキュリティ監査**: 年1回の包括的なセキュリティ監査
