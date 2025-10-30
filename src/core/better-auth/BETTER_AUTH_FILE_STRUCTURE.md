# Better Auth 設定ファイルの格納先ルール

## 📋 Better Authの推奨ファイル構造

Better Authには、設定ファイルの格納先に関する**推奨ルール**があります。ただし、厳密な規則ではなく、柔軟に配置できます。

## 🔧 サーバー側設定ファイル（`auth.ts`）

### 推奨される配置場所

Better Auth CLIは、以下の場所で`auth.ts`ファイルを**自動的に検索**します：

1. **プロジェクトルート**
   - `./auth.ts`

2. **`lib/`フォルダ**
   - `./lib/auth.ts`
   - `./src/lib/auth.ts`
   - `./app/lib/auth.ts`

3. **`utils/`フォルダ**
   - `./utils/auth.ts`
   - `./src/utils/auth.ts`
   - `./app/utils/auth.ts`

4. **`server/`フォルダ**
   - `./server/auth.ts`
   - `./src/server/auth.ts`

### 重要な要件

- ✅ ファイル名は`auth.ts`である必要があります（CLIが自動検索するため）
- ✅ 変数名は`auth`または`default` exportが必要です
- ✅ 以下のようにエクスポートする必要があります：

```typescript
// ✅ 推奨パターン
export const auth = betterAuth({
  // ...
});

// または
export default betterAuth({
  // ...
});
```

### CLIでの自動検索

Better Auth CLI（`generate`、`migrate`、`info`コマンド）は、デフォルトで以下の順序で`auth.ts`を検索します：

1. `./auth.ts`
2. `./utils/auth.ts`
3. `./lib/auth.ts`
4. `./src/utils/auth.ts`
5. `./src/lib/auth.ts`
6. `./app/lib/auth.ts`
7. `./server/auth.ts`

カスタムパスを指定する場合：

```bash
npx @better-auth/cli@latest generate --config ./custom/path/auth.ts
```

**⚠️ 重要: `src/core/better-auth/auth.ts`を使用する場合**

このプロジェクトでは`auth.ts`を`src/core/better-auth/auth.ts`に配置しているため、CLIコマンド実行時に`--config`オプションが必要です：

```bash
# 設定情報を確認
npx @better-auth/cli@latest info --config ./src/core/better-auth/auth.ts

# スキーマを生成
npx @better-auth/cli@latest generate --config ./src/core/better-auth/auth.ts

# マイグレーションを実行（Kyselyアダプターの場合）
npx @better-auth/cli@latest migrate --config ./src/core/better-auth/auth.ts
```

`package.json`にスクリプトを追加することで、毎回`--config`を指定する必要がなくなります（推奨）。

## 💻 クライアント側設定ファイル（`auth-client.ts`）

### 推奨される配置場所

- 📁 `lib/auth-client.ts`が**推奨**されています
- 特に厳密なルールはありませんが、一般的に`lib/`フォルダに配置します

### 例：

```typescript
// src/lib/auth-client.ts（推奨）
import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
});
```

## 📁 現在のプロジェクト構造

現在のプロジェクトでは、以下の構造になっています：

```
src/core/better-auth/
├── auth.ts                    ✅ Better Authサーバー設定
├── auth-client.ts             ✅ Better Authクライアント設定
├── auth-errors.ts             ⚠️ カスタムエラーハンドリング（ユーザー作成）
├── auth-errors-docs.ts        ⚠️ ドキュメントファイル（ユーザー作成）
└── BETTER_AUTH_FILE_STRUCTURE.md ✅ このファイル
```

### 状況評価

- ✅ `auth.ts`と`auth-client.ts`は`src/core/better-auth/`に配置されています
- ⚠️ Better Auth CLIは**自動検出できません**（`src/core/better-auth/`はデフォルト検索パスに含まれていないため）
- ✅ `--config`オプションで指定するか、package.jsonのスクリプトを使用します
- ⚠️ `auth-errors.ts`と`auth-errors-docs.ts`は、Better Authの必須ファイルではありません（カスタムユーティリティ）

## 🎯 結論

### Better Authの必須ファイル

1. **`auth.ts`** - サーバー側設定（CLIが自動検索するため推奨位置に配置）
2. **`auth-client.ts`** - クライアント側設定（`lib/`に配置が推奨）

### カスタムファイル（任意）

- `auth-errors.ts` - エラーハンドリングユーティリティ
- `auth-errors-docs.ts` - ドキュメントファイル
- その他のヘルパーファイル

## 📝 ベストプラクティス

1. **`auth.ts`は`lib/`または`src/lib/`に配置**
   - CLIが自動検出できる
   - プロジェクトの一般的な構造と一致

2. **`auth-client.ts`も`lib/`に配置**
   - クライアント設定が一箇所にまとまる
   - インポートパスが明確

3. **関連するカスタムファイルも`lib/`に配置**
   - `auth-errors.ts`などのヘルパー関数
   - 認証関連のユーティリティ

4. **ファイル名の命名規則**
   - `auth.ts` - サーバー設定（必須、CLIが検索）
   - `auth-client.ts` - クライアント設定（推奨）
   - `auth-*.ts` - その他の認証関連ファイル（任意）

## 🔍 参考リンク

- [Better Auth インストールガイド](https://www.better-auth.com/docs/installation)
- [Better Auth CLI](https://www.better-auth.com/docs/concepts/cli)
- [Better Auth クライアント](https://www.better-auth.com/docs/client)

