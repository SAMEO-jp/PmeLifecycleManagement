# Better Auth + Better Auth UI セットアップガイド

このプロジェクトでは、[Better Auth](https://www.better-auth.com/)と[Better Auth UI](https://better-auth-ui.com/)を使用して認証機能を実装しています。

## 📋 実装内容

### インストールされたパッケージ
- `better-auth` - モダンな認証ライブラリ
- `@daveyplate/better-auth-ui` - shadcn/uiベースの認証UIコンポーネント

### 実装された機能
- ✅ メール/パスワード認証
- ✅ サインアップ（新規ユーザー登録）
- ✅ サインイン（ログイン）
- ✅ セッション管理
- ✅ 自動サインイン（サインアップ後）

## 🚀 セットアップ手順

### 1. 環境変数の設定

`.env.local.example`を`.env.local`にコピーして、必要な情報を入力してください：

```bash
cp .env.local.example .env.local
```

`.env.local`ファイルを編集：

```env
# データベース設定
DATABASE_URL=postgresql://username:password@localhost:5432/dbname

# Better Auth設定（サーバーサイド）
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here-please-change-this-to-a-secure-random-string

# Better Auth設定（クライアントサイド）
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

**重要:** `BETTER_AUTH_SECRET`は安全なランダム文字列に変更してください。以下のコマンドで生成できます：

```bash
openssl rand -base64 32
```

### 2. データベースマイグレーションの実行

データベースに認証用のテーブルを作成します：

```bash
npx drizzle-kit migrate
```

### 3. 依存関係のインストール

```bash
pnpm install
```

### 4. 開発サーバーの起動

```bash
pnpm dev
```

## 📁 ファイル構造

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts          # Better Auth APIエンドポイント
│   ├── auth/
│   │   └── [authView]/
│   │       └── page.tsx              # 認証ページ（動的ルート）
│   └── layout.tsx                    # AuthProvider統合
├── components/
│   └── providers/
│       └── auth-provider.tsx         # AuthUIProvider設定
├── lib/
│   ├── auth.ts                       # Better Authサーバー設定
│   └── auth-client.ts                # Better Authクライアント設定
└── db/
    ├── index.ts                      # Drizzle DB インスタンス
    └── schema/
        └── auth.ts                   # 認証用データベーススキーマ
```

## 🔗 利用可能な認証ページ

Better Auth UIは以下のパスを自動的に提供します：

- `/auth/sign-in` - サインイン（ログイン）
- `/auth/sign-up` - サインアップ（新規登録）
- `/auth/forgot-password` - パスワードリセット要求
- `/auth/reset-password` - パスワードリセット
- `/auth/magic-link` - マジックリンク認証
- `/auth/logout` - ログアウト

## 🎨 カスタマイズ

### AuthViewのカスタマイズ

`src/app/auth/[authView]/page.tsx`で認証ページの外観をカスタマイズできます：

```tsx
<AuthView
    authView={authView}
    // カスタムプロップスを追加可能
/>
```

### Auth設定のカスタマイズ

`src/lib/auth.ts`でBetter Authの設定をカスタマイズできます：

```typescript
export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    // その他の設定を追加...
})
```

## 🧪 テスト方法

1. 開発サーバーを起動: `pnpm dev`
2. ブラウザで `http://localhost:3000/auth/sign-up` にアクセス
3. 新規ユーザーを登録
4. 自動的にサインインされることを確認
5. `/auth/logout` でログアウト
6. `/auth/sign-in` で再度ログイン

## 🔐 セキュリティに関する注意事項

- **本番環境では必ず HTTPS を使用してください**
- `BETTER_AUTH_SECRET`は安全な方法で管理してください（環境変数、シークレット管理サービス等）
- `.env.local`ファイルは絶対にGitにコミットしないでください（`.gitignore`に追加済み）
- 本番環境では`DATABASE_URL`や`BETTER_AUTH_URL`を適切な値に変更してください

## 📚 参考リンク

- [Better Auth 公式ドキュメント](https://www.better-auth.com/docs)
- [Better Auth UI 公式ドキュメント](https://better-auth-ui.com/)
- [Drizzle ORM ドキュメント](https://orm.drizzle.team/)

## 🆘 トラブルシューティング

### データベース接続エラー
- `DATABASE_URL`が正しく設定されているか確認
- データベースサーバーが起動しているか確認
- マイグレーションが実行されているか確認

### 認証エラー
- `BETTER_AUTH_SECRET`が設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認
- APIエンドポイント(`/api/auth/*`)が正しく動作しているか確認

### UIが表示されない
- `AuthProvider`が`layout.tsx`に正しく設定されているか確認
- 必要な依存関係がインストールされているか確認
- ブラウザのキャッシュをクリアして再試行
