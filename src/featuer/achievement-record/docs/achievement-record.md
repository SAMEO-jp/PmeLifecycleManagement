---
仕様書: 実績日報
実績日報の仕様書: true
仕様書No.: ""
日本語名: 13. 実績日報の設計図
---
# 実績日報入力システム設計図

## 目次

### 概要
- [システム概要](./README.md)
- [ページ構成とレイアウト](./page-layout.md)

### アーキテクチャ設計
- [アーキテクチャ概要](./architecture.md)
- [Provider層](./architecture.md#provider層)
- [コンポーネント層](./architecture.md#コンポーネント層)
- [フック層](./architecture.md#フック)
- [コアロジック](./architecture.md#コアロジック)

### 技術仕様
- [API仕様](./api.md)
- [型定義](./types.md)
- [定数・設定](./constants.md)

### 実装詳細
- [状態管理フロー](./state-management.md)
- [エラーハンドリング](./error-handling.md)
- [パフォーマンス最適化](./performance.md)
- [アクセシビリティ対応](./accessibility.md)

### 品質保証
- [テスト戦略](./testing.md)
- [セキュリティ考慮事項](./security.md)

---

## 📖 ドキュメント一覧

各詳細ドキュメントは `docs/` ディレクトリに分割されています：

### 概要
- [🏠 システム概要](./docs/README.md)
- [📱 ページ構成とレイアウト](./docs/page-layout.md)

### アーキテクチャ設計
- [🏗️ アーキテクチャ概要](./docs/architecture.md)
  - Provider層
  - コンポーネント層
  - フック層
  - コアロジック

### 技術仕様
- [🔌 API仕様](./docs/api.md)
- [📋 型定義](./docs/types.md)
- [⚙️ 定数・設定](./docs/constants.md)

### 実装詳細
- [🔄 状態管理フロー](./docs/error-handling.md#状態管理フロー)
- [🚨 エラーハンドリング](./docs/error-handling.md)
- [⚡ パフォーマンス最適化](./docs/performance.md)
- [♿ アクセシビリティ対応](./docs/accessibility.md)

### 品質保証
- [🧪 テスト戦略](./docs/testing.md)
- [🔒 セキュリティ考慮事項](./docs/security.md)

---

## ページ構成

他のページと異なる点：
- **① 左メインサイドバー**: このページ特有のメインコンテンツに変更
- **② ヘッダー**: このページ特有のヘッダーに変更

### ① 左メインサイドバー

#### カレンダービュー
- 表示する日付の操作機能
- 現在表示中の期間の視覚的表示
- 月表示と現在の週中心表示の切り替え機能
- 表示中の日付に色が塗られて強調表示
- ※ 詳細な仕様は後日決定

#### メニュー部分
- 「業務関連サイドバー」の内容を変更するアクション

#### アクション部分
- Outlook連携機能

### ② ヘッダー
- 現在の年と週情報の表示
- 矢印ボタンによる隣接週への移動機能

## MAINページの中身構成

### 必要なProvider層

実績日報入力システムでは、以下の3つのProvider層が必要：

1. **データベースProvider** (`achievement-record-api-provider.tsx`)
   - データベースとのAPI通信を担当
   - 業務データの取得・保存・更新処理
   - エラーハンドリング

2. **選択状態管理Provider** (`achievement-record-selection-provider.tsx`)
   - カレンダーの選択イベントを監視
   - 現在選択されている日付・業務項目の状態管理
   - 選択変更時のイベント発火

3. **ローカルデータ管理Provider** (`achievement-record-data-provider.tsx`)
   - 編集中の業務データをローカルで保持
   - UI状態（フォーム入力値、表示モードなど）の管理
   - 一時保存データの処理

### 必要なコンポーネント層

#### UIコンポーネント (`component/`)

1. **カレンダーコンポーネント** (`Calendar.tsx`)
   - 日付選択機能
   - 月/週表示切り替え
   - 選択日付の強調表示

2. **業務入力フォーム** (`WorkEntryForm.tsx`)
   - 業務内容入力フィールド
   - 時間入力
   - 保存/キャンセルボタン

3. **業務一覧表示** (`WorkList.tsx`)
   - 日付別業務表示
   - 編集/削除アクション

4. **業務詳細サイドバー** (`WorkDetailSidebar.tsx`)
   - 業務詳細情報の表示
   - 関連ドキュメントリンク

#### コンテナコンポーネント (`containers/`)

1. **メインコンテナ** (`AchievementRecordContainer.tsx`)
   - 全体レイアウト管理
   - Provider統合

2. **サイドバーコンテナ** (`SidebarContainer.tsx`)
   - 左サイドバーコンテンツ管理

3. **コンテンツコンテナ** (`ContentContainer.tsx`)
   - メインコンテンツエリア管理

### 必要な型定義 (`types/`)

1. **業務データ型** (`work.types.ts`)
   ```typescript
   interface WorkEntry {
     id: string
     date: Date
     title: string
     description: string
     hours: number
     category: string
   }
   ```

2. **APIレスポンス型** (`api.types.ts`)
   - 取得レスポンス
   - 保存レスポンス
   - エラーレスポンス

3. **UI状態型** (`ui.types.ts`)
   - 選択状態
   - フォーム状態
   - 表示モード

### 必要なフック (`hooks/`)

1. **データ取得フック** (`useWorkData.ts`)
   - APIからのデータ取得
   - キャッシュ管理

2. **フォーム管理フック** (`useWorkForm.ts`)
   - フォーム状態管理
   - バリデーション

3. **選択状態フック** (`useSelection.ts`)
   - カレンダー選択管理

### コアロジック (`core/`)

1. **APIサービス** (`workApi.ts`)
   - RESTful API通信
   - エラーハンドリング

2. **データ変換** (`dataTransformers.ts`)
   - APIデータ ↔ UIデータ変換

3. **バリデーション** (`validators.ts`)
   - 入力データ検証

### 定数・設定 (`constants.ts`)

```typescript
// 表示設定
export const CALENDAR_VIEW_MODES = {
  MONTH: 'month',
  WEEK: 'week'
} as const

// APIエンドポイント
export const API_ENDPOINTS = {
  WORK_ENTRIES: '/api/work-entries',
  CATEGORIES: '/api/work-categories'
} as const

// バリデーションルール
export const VALIDATION_RULES = {
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_WORK_HOURS: 24
} as const
```

### API仕様

#### エンドポイント一覧

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/work-entries` | 業務一覧取得 |
| POST | `/api/work-entries` | 業務新規作成 |
| PUT | `/api/work-entries/{id}` | 業務更新 |
| DELETE | `/api/work-entries/{id}` | 業務削除 |
| GET | `/api/work-categories` | 業務カテゴリ取得 |

#### APIレスポンス形式

```typescript
// 業務エントリ
interface WorkEntryResponse {
  id: string
  date: string
  title: string
  description: string
  hours: number
  categoryId: string
  createdAt: string
  updatedAt: string
}

// エラーレスポンス
interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: any
  }
}
```

### 状態管理フロー

#### データフロー図

```
ユーザーの操作 → UIコンポーネント → フック → Provider → APIサービス → データベース
                        ↓
                   状態更新 → UI再レンダリング
```

#### 状態遷移

```
初期状態 → データ読み込み中 → データ表示状態 → 編集状態 → 保存処理中 → 保存完了/エラー
```

### エラーハンドリング

1. **APIエラー**
   - ネットワークエラー
   - サーバーエラー (5xx)
   - クライアントエラー (4xx)
   - 認証エラー

2. **UIエラー**
   - フォームバリデーションエラー
   - 必須フィールド未入力
   - データ形式エラー

3. **回復戦略**
   - エラーメッセージ表示
   - リトライ機能
   - フォールバックUI

### パフォーマンス最適化

1. **データ取得**
   - ページング実装
   - キャッシュ戦略
   - 遅延読み込み

2. **UI最適化**
   - 仮想スクロール (大量データ時)
   - メモ化 (React.memo, useMemo)
   - コード分割

3. **バンドル最適化**
   - 動的インポート
   - Tree Shaking
   - 画像最適化

### アクセシビリティ対応

1. **キーボード操作**
   - Tabキーでのフォーカス移動
   - Enter/Spaceでのアクション実行
   - Escapeでのキャンセル

2. **スクリーンリーダー**
   - ARIAラベル付与
   - セマンティックHTML使用
   - フォーカス管理

3. **視覚支援**
   - 十分なコントラスト比
   - フォントサイズ調整対応
   - 色覚異常考慮

### テスト戦略

#### テスト対象

1. **ユニットテスト**
   - フック関数
   - ユーティリティ関数
   - バリデーション関数

2. **統合テスト**
   - コンポーネント統合
   - API通信
   - 状態管理

3. **E2Eテスト**
   - ユーザーフロー
   - フォーム操作
   - データ永続化

#### テストファイル構造

```
__tests__/
├── unit/
│   ├── hooks/
│   ├── utils/
│   └── validators/
├── integration/
│   ├── components/
│   └── providers/
└── e2e/
    ├── flows/
    └── pages/
```

### セキュリティ考慮事項

1. **入力検証**
   - XSS対策 (サニタイズ)
   - SQLインジェクション対策
   - 型チェック

2. **認証・認可**
   - JWTトークン検証
   - 権限チェック
   - セッション管理

3. **データ保護**
   - 機密情報暗号化
   - HTTPS通信
   - CSRF対策

このページは以下の3つのセクションで構成される：

#### 画面レイアウト
```
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│   業務関連サイドバー   │ │      業務表示欄       │ │   業務詳細入力欄      │
│                     │ │                     │ │                     │
│  業務関連情報の表示・  │ │    業務内容の表示      │ │ 業務詳細情報の入力     │
│  操作領域            │ │    領域              │ │   領域               │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

#### 各セクションの詳細
1. **業務関連サイドバー** - 業務関連情報の表示・操作領域
2. **業務表示欄** - 業務内容の表示領域
3. **業務詳細入力欄** - 業務詳細情報の入力領域