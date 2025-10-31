---
仕様書: 実績日報
実績日報の仕様書: true
仕様書No.: ""
日本語名: 6. API仕様
---

# API仕様

## 概要

実績日報入力システムのAPIは、RESTful原則に基づいた設計となっており、業務データのCRUD操作を提供します。認証にはJWTトークンを、データ形式にはJSONを使用します。

## ベースURL

```
https://api.example.com/v1
```

## 認証

すべてのAPIリクエストには、AuthorizationヘッダーにBearerトークンを含める必要があります。

```http
Authorization: Bearer <jwt-token>
```

## エンドポイント一覧

| メソッド | エンドポイント | 説明 | 認証 |
|---------|---------------|------|------|
| GET | `/api/work-entries` | 業務一覧取得 | 必須 |
| POST | `/api/work-entries` | 業務新規作成 | 必須 |
| PUT | `/api/work-entries/{id}` | 業務更新 | 必須 |
| DELETE | `/api/work-entries/{id}` | 業務削除 | 必須 |
| GET | `/api/work-categories` | 業務カテゴリ取得 | 必須 |
| GET | `/api/work-entries/{id}` | 業務詳細取得 | 必須 |

## 詳細仕様

### 業務一覧取得

**エンドポイント**: `GET /api/work-entries`

**クエリパラメータ**:

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `startDate` | string | 任意 | 開始日 (YYYY-MM-DD) |
| `endDate` | string | 任意 | 終了日 (YYYY-MM-DD) |
| `categoryId` | string | 任意 | カテゴリID |
| `page` | number | 任意 | ページ番号 (デフォルト: 1) |
| `limit` | number | 任意 | 1ページあたりの件数 (デフォルト: 20) |

**レスポンス**:

```json
{
  "data": [
    {
      "id": "work_123",
      "date": "2024-01-15",
      "title": "会議参加",
      "description": "プロジェクトミーティング",
      "hours": 2.5,
      "categoryId": "meeting",
      "createdAt": "2024-01-15T09:00:00Z",
      "updatedAt": "2024-01-15T09:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### 業務新規作成

**エンドポイント**: `POST /api/work-entries`

**リクエストボディ**:

```json
{
  "date": "2024-01-15",
  "title": "会議参加",
  "description": "プロジェクトミーティング",
  "hours": 2.5,
  "categoryId": "meeting"
}
```

**必須フィールド**:
- `date`: 業務日付
- `title`: 業務タイトル
- `hours`: 作業時間（時間単位）

**レスポンス**:

```json
{
  "data": {
    "id": "work_123",
    "date": "2024-01-15",
    "title": "会議参加",
    "description": "プロジェクトミーティング",
    "hours": 2.5,
    "categoryId": "meeting",
    "createdAt": "2024-01-15T09:00:00Z",
    "updatedAt": "2024-01-15T09:00:00Z"
  }
}
```

### 業務更新

**エンドポイント**: `PUT /api/work-entries/{id}`

**リクエストボディ**: 新規作成と同じ形式（部分更新可能）

### 業務削除

**エンドポイント**: `DELETE /api/work-entries/{id}`

**レスポンス**:

```json
{
  "success": true,
  "message": "業務エントリが削除されました"
}
```

### 業務カテゴリ取得

**エンドポイント**: `GET /api/work-categories`

**レスポンス**:

```json
{
  "data": [
    {
      "id": "meeting",
      "name": "会議",
      "color": "#3B82F6"
    },
    {
      "id": "development",
      "name": "開発作業",
      "color": "#10B981"
    }
  ]
}
```

## データ型定義

### WorkEntry (業務エントリ)

```typescript
interface WorkEntry {
  id: string
  date: string          // YYYY-MM-DD形式
  title: string         // 最大100文字
  description?: string  // 最大500文字
  hours: number         // 0.5〜24時間
  categoryId: string
  createdAt: string
  updatedAt: string
}
```

### WorkCategory (業務カテゴリ)

```typescript
interface WorkCategory {
  id: string
  name: string
  color: string        // HEXカラーコード
}
```

## エラーレスポンス

### 共通エラーフォーマット

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力データに誤りがあります",
    "details": {
      "field": "hours",
      "reason": "作業時間は0.5〜24時間の範囲で入力してください"
    }
  }
}
```

### エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| `VALIDATION_ERROR` | 400 | 入力データ検証エラー |
| `UNAUTHORIZED` | 401 | 認証エラー |
| `FORBIDDEN` | 403 | 権限エラー |
| `NOT_FOUND` | 404 | リソースが見つからない |
| `CONFLICT` | 409 | リソース競合 |
| `RATE_LIMIT_EXCEEDED` | 429 | レート制限超過 |
| `INTERNAL_ERROR` | 500 | サーバー内部エラー |

## レート制限

- **認証ユーザー**: 1分間に100リクエスト
- **未認証ユーザー**: 1分間に10リクエスト

レート制限超過時は429エラーが返されます。

## ページング

一覧取得APIでは以下のページング仕様が適用されます：

- **デフォルトlimit**: 20件
- **最大limit**: 100件
- **ページ番号**: 1始まり

## フィルタリング・ソート

### 利用可能なフィルター

- `date`: 日付範囲指定
- `categoryId`: カテゴリフィルタ
- `title`: タイトル部分一致検索

### ソートオプション

- `date`: 日付順（昇順/降順）
- `createdAt`: 作成日時順
- `hours`: 作業時間順

## バリデーションルール

### 業務エントリ

- **date**: 有効な日付形式、過去の日付は禁止
- **title**: 1〜100文字、必須
- **description**: 0〜500文字、オプション
- **hours**: 0.5〜24.0、0.5刻み、必須
- **categoryId**: 有効なカテゴリID、必須

### クエリパラメータ

- **startDate/endDate**: YYYY-MM-DD形式
- **page**: 1以上の整数
- **limit**: 1〜100の整数

## キャッシュ戦略

- **GETリクエスト**: 5分間キャッシュ
- **POST/PUT/DELETE**: キャッシュ無効化
- **ETag**: 条件付きリクエスト対応

## CORS設定

クロスオリジンリクエストを許可するドメイン：
- `https://app.example.com`
- `https://admin.example.com`
