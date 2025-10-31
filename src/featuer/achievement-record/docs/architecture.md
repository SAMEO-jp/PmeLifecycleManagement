---
仕様書: 実績日報
実績日報の仕様書: true
仕様書No.: ""
日本語名: 3. アーキテクチャ設計
---

# アーキテクチャ設計

## 概要

実績日報入力システムのアーキテクチャは、以下の原則に基づいて設計されています：

- **関心の分離**: データ、表示、ビジネスロジックの明確な分離
- **再利用性**: コンポーネントとロジックの再利用
- **型安全**: TypeScriptによる完全な型チェック
- **保守性**: テスト容易で変更に強い構造

## アーキテクチャ層

```
┌─────────────────┐
│   Presentation  │  ← UIコンポーネント、コンテナ
├─────────────────┤
│   Application   │  ← フック、Provider
├─────────────────┤
│    Domain       │  ← コアロジック、型定義
├─────────────────┤
│  Infrastructure │  ← API通信、外部サービス
└─────────────────┘
```

## Provider層

実績日報入力システムでは、以下の3つのProvider層が必要：

### 1. データベースProvider (`achievement-record-api-provider.tsx`)
- **責務**: データベースとのAPI通信を担当
- **機能**:
  - 業務データの取得・保存・更新処理
  - エラーハンドリング
  - キャッシュ管理
- **依存関係**: APIサービス、コアロジック

### 2. 選択状態管理Provider (`achievement-record-selection-provider.tsx`)
- **責務**: カレンダーの選択イベントを監視
- **機能**:
  - 現在選択されている日付・業務項目の状態管理
  - 選択変更時のイベント発火
  - 複数コンポーネント間での状態同期
- **依存関係**: UIコンポーネント、フック

### 3. ローカルデータ管理Provider (`achievement-record-data-provider.tsx`)
- **責務**: 編集中の業務データをローカルで保持
- **機能**:
  - UI状態（フォーム入力値、表示モードなど）の管理
  - 一時保存データの処理
  - フォームデータの永続化
- **依存関係**: フォームコンポーネント、バリデーション

## コンポーネント層

### UIコンポーネント (`component/`)

#### 1. カレンダーコンポーネント (`Calendar.tsx`)
- **機能**:
  - 日付選択機能
  - 月/週表示切り替え
  - 選択日付の強調表示
- **Props**: `selectedDate`, `viewMode`, `onDateSelect`
- **依存**: `useSelection`フック

#### 2. 業務入力フォーム (`WorkEntryForm.tsx`)
- **機能**:
  - 業務内容入力フィールド
  - 時間入力
  - 保存/キャンセルボタン
- **Props**: `workEntry`, `onSave`, `onCancel`
- **依存**: `useWorkForm`フック

#### 3. 業務一覧表示 (`WorkList.tsx`)
- **機能**:
  - 日付別業務表示
  - 編集/削除アクション
- **Props**: `workEntries`, `onEdit`, `onDelete`
- **依存**: `useWorkData`フック

#### 4. 業務詳細サイドバー (`WorkDetailSidebar.tsx`)
- **機能**:
  - 業務詳細情報の表示
  - 関連ドキュメントリンク
- **Props**: `selectedWork`, `relatedDocuments`
- **依存**: 選択状態Provider

### コンテナコンポーネント (`containers/`)

#### 1. メインコンテナ (`AchievementRecordContainer.tsx`)
- **責務**: 全体レイアウト管理、Provider統合
- **機能**:
  - 全てのProviderの統合
  - レイアウト構造の管理
  - エラーバウンダリの設定

#### 2. サイドバーコンテナ (`SidebarContainer.tsx`)
- **責務**: 左サイドバーコンテンツ管理
- **機能**:
  - カレンダーとメニューの統合
  - サイドバー状態の管理

#### 3. コンテンツコンテナ (`ContentContainer.tsx`)
- **責務**: メインコンテンツエリア管理
- **機能**:
  - 業務一覧と詳細入力の統合
  - レスポンシブレイアウト調整

## フック層 (`hooks/`)

### 1. データ取得フック (`useWorkData.ts`)
```typescript
interface UseWorkDataReturn {
  workEntries: WorkEntry[]
  isLoading: boolean
  error: Error | null
  refetch: () => void
  createWorkEntry: (entry: WorkEntryInput) => Promise<void>
  updateWorkEntry: (id: string, entry: WorkEntryInput) => Promise<void>
  deleteWorkEntry: (id: string) => Promise<void>
}
```
- **機能**: APIからのデータ取得、キャッシュ管理

### 2. フォーム管理フック (`useWorkForm.ts`)
```typescript
interface UseWorkFormReturn {
  formData: WorkEntryFormData
  errors: ValidationErrors
  isValid: boolean
  handleChange: (field: string, value: any) => void
  handleSubmit: (e: FormEvent) => void
  reset: () => void
}
```
- **機能**: フォーム状態管理、バリデーション

### 3. 選択状態フック (`useSelection.ts`)
```typescript
interface UseSelectionReturn {
  selectedDate: Date | null
  selectedWorkId: string | null
  viewMode: 'month' | 'week'
  selectDate: (date: Date) => void
  selectWork: (workId: string) => void
  changeViewMode: (mode: 'month' | 'week') => void
}
```
- **機能**: カレンダー選択管理

## コアロジック (`core/`)

### 1. APIサービス (`workApi.ts`)
- **機能**: RESTful API通信、エラーハンドリング
- **メソッド**:
  - `getWorkEntries(params: WorkQueryParams)`
  - `createWorkEntry(entry: WorkEntryInput)`
  - `updateWorkEntry(id: string, entry: WorkEntryInput)`
  - `deleteWorkEntry(id: string)`

### 2. データ変換 (`dataTransformers.ts`)
- **機能**: APIデータ ↔ UIデータ変換
- **変換関数**:
  - `apiToUi`: APIレスポンス → UIデータ
  - `uiToApi`: UIデータ → APIリクエスト

### 3. バリデーション (`validators.ts`)
- **機能**: 入力データ検証
- **検証関数**:
  - `validateWorkEntry`: 業務エントリ全体の検証
  - `validateRequired`: 必須フィールド検証
  - `validateDateRange`: 日付範囲検証

## 定数・設定 (`constants.ts`)

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

// UI設定
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  ITEMS_PER_PAGE: 20,
  MAX_FILE_SIZE: 10 * 1024 * 1024 // 10MB
} as const
```

## データフロー

```
ユーザーの操作
    ↓
UIコンポーネント (component/)
    ↓
フック (hooks/)
    ↓
Provider (context/)
    ↓
コアロジック (core/)
    ↓
外部API/データベース
```

このアーキテクチャにより、各層の責務が明確に分離され、保守性とテスト容易性が高いシステムを実現しています。
