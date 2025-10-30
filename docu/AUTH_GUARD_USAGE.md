# 認証ガード機能の使い方

## 概要

認証が必要なページを作成するには、`AuthGuard`コンポーネントを使用します。

## 使用方法

### 基本的な使い方

```tsx
"use client"

import { AppLayout } from "../components/AppLayout"
import { AuthGuard } from "../components/AuthGuard"

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <AppLayout>
        {/* 認証済みユーザーのみがアクセスできるコンテンツ */}
        <div>保護されたコンテンツ</div>
      </AppLayout>
    </AuthGuard>
  )
}
```

### カスタムリダイレクト先を指定する場合

```tsx
<AuthGuard redirectTo="/custom-login">
  <AppLayout>
    {/* コンテンツ */}
  </AppLayout>
</AuthGuard>
```

## 動作

1. **認証状態の確認中**: 認証状態を確認している間は、ローディングスピナーが表示されます。

2. **未認証ユーザー**: ログインしていないユーザーがアクセスしようとすると、自動的にログインページ（デフォルト: `/auth/sign-in`）にリダイレクトされます。

3. **認証済みユーザー**: ログインしているユーザーは、保護されたコンテンツにアクセスできます。

## 実装済みの保護されたページ

- `/dashboard` - ダッシュボードページ
- `/equipment` - 設備管理ページ

これらのページは、`AuthGuard`コンポーネントでラップされているため、ログインしていないユーザーはアクセスできません。

## 技術的な詳細

- `AuthGuard`コンポーネントは、`authClient.useSession()`を使用して認証状態を確認します。
- 未認証ユーザーは`useRouter`を使用してリダイレクトされます。
- 認証状態の確認中は、`isPending`状態が`true`になり、ローディング表示が行われます。

