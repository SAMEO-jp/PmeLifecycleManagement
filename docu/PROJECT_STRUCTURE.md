## プロジェクト概要

| 技術領域            | 使用技術                                    |
| --------------- | --------------------------------------- |
| Framework       | Next.js 16                              |
| Language        | TypeScript 5                            |
| Styling (main)  | Tailwind CSS + shadcn/ui                |
| Styling (auth)  | Better Auth UI                          |
| Database        | Supabase(ローカル/PostgreSQL) + Drizzle ORM |
| Authentication  | Better Auth                             |
| Node.js         | 18+                                     |
| Package Manager | pnpm                                    |
| UI Library      | shadcn/ui + Tailwind CSS                |
## ファイル構造

### ルートレベル設定ファイル

| 分類         | ファイル                           | 説明                    |
| ---------- | ------------------------------ | --------------------- |
| Node.js    | `package.json`                 | プロジェクトの依存関係とスクリプト設定   |
|            | `pnpm-lock.yaml`               | pnpmのロックファイル          |
|            | `pnpm-workspace.yaml`          | pnpmワークスペース設定         |
| TypeScript | `tsconfig.json`                | TypeScript設定          |
| PostCSS    | `postcss.config.mjs`           | PostCSS設定             |
| next       | `next.config.ts`               | Next.js設定             |
|            | `next-env.d.ts`                | Next.js TypeScript型定義 |
|            | `middleware.ts`                | Next.jsミドルウェア         |
| drizzle    | `drizzle.config.ts`            | Drizzle ORM設定         |
| ESLint     | `eslint.config.mjs`            | ESLint設定              |
|            | `eslint-formatter-japanese.js` | ESLint日本語フォーマッター      |
| UIライブラリ設定  | `components.json`              | shadcn/ui設定           |

### ドキュメント

```
docu/
├── setup.md                    # セットアップ手順
└── AUTH_GUARD_USAGE.md         # 認証ガード使用方法
```

### データベース関連

```
db/
├── index.ts                    # データベース接続設定
├── AUTH_SETUP.md               # 認証セットアップドキュメント
├── schema/
│   └── auth.ts                 # 認証スキーマ
├── schemas/                    # その他のスキーマ
└── migrations/                 # データベースマイグレーション
    ├── 0000_graceful_phantom_reporter.sql
    └── meta/
        ├── _journal.json
        └── 0000_snapshot.json
```

### Supabase設定

```
supabase/
└── config.toml                 # Supabase設定ファイル
```

### 公開アセット

```
public/
├── favicon.ico                 # ファビコン
├── file.svg                    # ファイルアイコン
├── globe.svg                   # 地球儀アイコン
├── next.svg                    # Next.jsアイコン
├── vercel.svg                  # Vercelアイコン
└── window.svg                  # ウィンドウアイコン
```

### ソースコード

#### アプリケーションコア

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # ルートレイアウト
│   ├── page.tsx               # ホームページ
│   ├── globals.css            # グローバルスタイル
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts   # Better Auth APIルート
│   ├── auth/
│   │   └── [authView]/
│   │       └── page.tsx       # 認証ページ
│   ├── dashboard/
│   │   └── page.tsx           # ダッシュボードページ
│   ├── equipment/
│   │   └── page.tsx           # 設備管理ページ
│   └── sample/
│       └── page.tsx           # サンプルページ
├── components/                 # 共有コンポーネント
│   ├── auth-error-example.tsx  # 認証エラー例
│   ├── providers/
│   │   └── auth-provider.tsx   # 認証プロバイダー
│   └── ui/                     # shadcn/uiコンポーネント
│       ├──[ui] 
├── core/                       # コア機能
│   ├── better-auth/            # Better Auth設定
│   │   ├── auth.ts
│   │   ├── auth-client.ts
│   │   ├── auth-errors.ts
│   │   ├── auth-errors-docs.ts
│   │   └── BETTER_AUTH_FILE_STRUCTURE.md
│   └── shadcn/                 # shadcn/ui関連
│       ├── hooks/
│       │   └── use-mobile.ts
│       └── lib/
│           └── utils.ts
├── featuer/                    # 機能モジュール（未使用）
└── lib/                        # ユーティリティライブラリ
```

### その他のファイル

| ファイル | 説明 |
|---------|------|
| `README.md` | プロジェクト概要と使用方法 |
| `Untitled.md` | 未整理のドキュメント |
| `無題のファイル.base` | 一時ファイル |

## ディレクトリ説明

### `/src/app`
Next.js 16のApp Routerを使用したアプリケーションのページとAPIルートを配置しています。

### `/src/components`
再利用可能なReactコンポーネントを配置しています。
- `ui/` ディレクトリにはshadcn/uiのコンポーネント
- アプリ固有のコンポーネントは直接配置

### `/src/core`
コア機能の設定と実装を配置しています。
- `better-auth/` - 認証機能の設定
- `shadcn/` - shadcn/ui関連のユーティリティ

### `/db`
データベース関連のファイル
- Drizzle ORMの設定とマイグレーション
- データベーススキーマ定義

### `/docu`
プロジェクトのドキュメントを配置しています。


---

*このドキュメントはプロジェクト構造の概要です。詳細な実装については各ファイルのコメントや関連ドキュメントを参照してください。*
