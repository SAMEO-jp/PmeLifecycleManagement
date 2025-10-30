# PMESystem セットアップ手順

このドキュメントでは、PMESystemプロジェクトの初期セットアップ手順について説明します。

## 前提条件

- Node.js がインストールされていること
- pnpm がインストールされていること

## 1. shadcn/ui の初期化

shadcn/ui をプロジェクトに初期化します。

```bash
pnpm dlx shadcn@latest init
```

## 2. shadcn/ui コンポーネントの追加

すべての利用可能なコンポーネントを追加します。

```bash
pnpm dlx shadcn@latest add -a
```

### pnpm approve-builds の実行

pnpmはビルドスクリプトの実行に明示的な承認を要求します。

```bash
pnpm approve-builds
```

実行例:
```
✔ Choose which packages to build (Press <space> to select, <a> to toggle all, <i> to invert selection) · msw
✔ The next packages will now be built: msw.
Do you approve? (y/N) · true
```

## 3. プロジェクト構造の整理

`src/core` フォルダを作成し、shadcn関連のファイルを整理します。また、`components.json` を修正します。

## 4. Supabase のセットアップ

Supabase を開発環境に追加し、初期化します。

```bash
# Supabase のインストール
pnpm add supabase --save-dev --allow-build=supabase

# Supabase の初期化
pnpx supabase init

# ローカル開発環境の起動
pnpx supabase start
```

Supabase 起動後の情報:
```
Started supabase local development setup.

         API URL: http://127.0.0.1:54331
     GraphQL URL: http://127.0.0.1:54331/graphql/v1
  S3 Storage URL: http://127.0.0.1:54331/storage/v1/s3
         MCP URL: http://127.0.0.1:54331/mcp
    Database URL: postgresql://postgres:postgres@127.0.0.1:54332/postgres
      Studio URL: http://127.0.0.1:54333
     Mailpit URL: http://127.0.0.1:54334
 Publishable key: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH
      Secret key: sb_secret_N7UND0UgjKTVK-Uodkm0Hg_xSvEMPvz
   S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
   S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
       S3 Region: local
```

## 5. Drizzle ORM の設定

データベース操作のための Drizzle ORM をセットアップします。

```bash
# Drizzle ORM と関連パッケージのインストール
pnpm add drizzle-orm dotenv postgres
pnpm add -D drizzle-kit
```

### 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、データベースURLを設定します。

```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54332/postgres
```

## 6. Better Auth の追加

認証機能のための Better Auth を追加します。

```bash
pnpm add better-auth
```

## 次のステップ

セットアップが完了したら、以下の作業を行ってください：

1. データベーススキーマの定義
2. 認証機能の実装
3. UIコンポーネントの配置
4. APIルートの設定

詳細な実装手順については、各機能別のドキュメントを参照してください。
