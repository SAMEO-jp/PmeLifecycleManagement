---
仕様書: 実績日報
実績日報の仕様書: true
仕様書No.: ""
日本語名: 4. 型定義
---

# 型定義

## 概要

実績日報入力システムのTypeScript型定義を定義します。これらの型はAPI通信、UIコンポーネント、状態管理で使用されます。

## コアデータ型

### WorkEntry (業務エントリ)

業務エントリの基本データ構造です。

```typescript
interface WorkEntry {
  /** 一意の識別子 */
  id: string

  /** 業務日付 */
  date: Date

  /** 業務タイトル */
  title: string

  /** 業務詳細説明 */
  description?: string

  /** 作業時間（時間単位） */
  hours: number

  /** 業務カテゴリID */
  categoryId: string

  /** 作成日時 */
  createdAt: Date

  /** 更新日時 */
  updatedAt: Date
}
```

### WorkCategory (業務カテゴリ)

業務のカテゴリを表す型です。

```typescript
interface WorkCategory {
  /** カテゴリID */
  id: string

  /** カテゴリ名 */
  name: string

  /** 表示色（HEX形式） */
  color: string

  /** 説明 */
  description?: string

  /** 並び順 */
  order: number
}
```

### User (ユーザー)

システム利用者を表す型です。

```typescript
interface User {
  /** ユーザーID */
  id: string

  /** メールアドレス */
  email: string

  /** 表示名 */
  displayName: string

  /** アバターURL */
  avatarUrl?: string

  /** 権限レベル */
  role: 'admin' | 'manager' | 'user'

  /** 部署 */
  department?: string
}
```

## API関連型

### APIリクエスト型

#### WorkEntryCreateRequest

新規業務エントリ作成時のリクエスト型です。

```typescript
interface WorkEntryCreateRequest {
  date: string        // YYYY-MM-DD形式
  title: string       // 1-100文字
  description?: string // 0-500文字
  hours: number       // 0.5-24.0
  categoryId: string  // 有効なカテゴリID
}
```

#### WorkEntryUpdateRequest

業務エントリ更新時のリクエスト型です。

```typescript
interface WorkEntryUpdateRequest {
  title?: string
  description?: string
  hours?: number
  categoryId?: string
}
```

#### WorkEntriesQuery

業務エントリ一覧取得時のクエリパラメータ型です。

```typescript
interface WorkEntriesQuery {
  startDate?: string    // YYYY-MM-DD形式
  endDate?: string      // YYYY-MM-DD形式
  categoryId?: string
  page?: number         // 1以上の整数
  limit?: number        // 1-100の整数
  sortBy?: 'date' | 'createdAt' | 'hours'
  sortOrder?: 'asc' | 'desc'
}
```

### APIレスポンス型

#### ApiResponse<T>

汎用APIレスポンス型です。

```typescript
interface ApiResponse<T> {
  data: T
  success: true
}
```

#### PaginatedResponse<T>

ページング付きレスポンス型です。

```typescript
interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  success: true
}
```

#### ApiErrorResponse

エラーレスポンス型です。

```typescript
interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, any>
  }
  success: false
}
```

#### WorkEntryResponse

APIからの業務エントリレスポンス型です。

```typescript
interface WorkEntryResponse {
  id: string
  date: string          // YYYY-MM-DD形式
  title: string
  description?: string
  hours: number
  categoryId: string
  createdAt: string     // ISO 8601形式
  updatedAt: string     // ISO 8601形式
}
```

## UI状態型

### フォーム関連型

#### WorkEntryFormData

業務入力フォームのデータ型です。

```typescript
interface WorkEntryFormData {
  date: string
  title: string
  description: string
  hours: string        // フォーム入力時はstring
  categoryId: string
}
```

#### FormValidationErrors

フォームバリデーションエラーの型です。

```typescript
interface FormValidationErrors {
  date?: string
  title?: string
  description?: string
  hours?: string
  categoryId?: string
}
```

#### FormState

フォーム全体の状態型です。

```typescript
interface FormState {
  data: WorkEntryFormData
  errors: FormValidationErrors
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
}
```

### カレンダー関連型

#### CalendarViewMode

カレンダーの表示モード型です。

```typescript
type CalendarViewMode = 'month' | 'week'
```

#### CalendarSelection

カレンダー選択状態の型です。

```typescript
interface CalendarSelection {
  selectedDate: Date | null
  selectedRange: {
    start: Date
    end: Date
  } | null
  viewMode: CalendarViewMode
  currentMonth: Date
}
```

### コンポーネントProps型

#### CalendarProps

カレンダーコンポーネントのProps型です。

```typescript
interface CalendarProps {
  selectedDate?: Date
  viewMode?: CalendarViewMode
  onDateSelect?: (date: Date) => void
  onViewModeChange?: (mode: CalendarViewMode) => void
  highlightedDates?: Date[]
  disabledDates?: Date[]
  className?: string
}
```

#### WorkEntryFormProps

業務入力フォームのProps型です。

```typescript
interface WorkEntryFormProps {
  initialData?: Partial<WorkEntryFormData>
  categories: WorkCategory[]
  onSubmit: (data: WorkEntryCreateRequest) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  className?: string
}
```

#### WorkListProps

業務一覧コンポーネントのProps型です。

```typescript
interface WorkListProps {
  entries: WorkEntry[]
  categories: WorkCategory[]
  onEdit?: (entry: WorkEntry) => void
  onDelete?: (entry: WorkEntry) => Promise<void>
  onSelect?: (entry: WorkEntry) => void
  selectedId?: string
  isLoading?: boolean
  className?: string
}
```

## Context/Provider型

### AchievementRecordContextType

メインのContext型です。

```typescript
interface AchievementRecordContextType {
  // データ関連
  workEntries: WorkEntry[]
  categories: WorkCategory[]
  isLoading: boolean
  error: string | null

  // 選択状態関連
  selectedDate: Date | null
  selectedWorkId: string | null
  viewMode: CalendarViewMode

  // アクション
  selectDate: (date: Date) => void
  selectWork: (workId: string) => void
  changeViewMode: (mode: CalendarViewMode) => void
  createWorkEntry: (data: WorkEntryCreateRequest) => Promise<void>
  updateWorkEntry: (id: string, data: WorkEntryUpdateRequest) => Promise<void>
  deleteWorkEntry: (id: string) => Promise<void>
  refetchData: () => void
}
```

## ユーティリティ型

### DeepPartial<T>

オブジェクトのすべてのプロパティをオプションにする型です。

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}
```

### ApiStatus

API呼び出しの状態を表す型です。

```typescript
type ApiStatus = 'idle' | 'loading' | 'success' | 'error'
```

### SortDirection

ソート方向の型です。

```typescript
type SortDirection = 'asc' | 'desc'
```

## フック戻り値型

### UseWorkDataReturn

データ取得フックの戻り値型です。

```typescript
interface UseWorkDataReturn {
  workEntries: WorkEntry[]
  categories: WorkCategory[]
  isLoading: boolean
  error: ApiError | null
  createWorkEntry: (data: WorkEntryCreateRequest) => Promise<void>
  updateWorkEntry: (id: string, data: WorkEntryUpdateRequest) => Promise<void>
  deleteWorkEntry: (id: string) => Promise<void>
  refetch: () => void
}
```

### UseWorkFormReturn

フォーム管理フックの戻り値型です。

```typescript
interface UseWorkFormReturn {
  formData: WorkEntryFormData
  errors: FormValidationErrors
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
  handleChange: (field: keyof WorkEntryFormData, value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  reset: () => void
  setErrors: (errors: FormValidationErrors) => void
}
```

## エラー型

### ValidationError

バリデーションエラーの詳細型です。

```typescript
interface ValidationError {
  field: string
  code: string
  message: string
  value?: any
}
```

### ApiError

APIエラーの型です。

```typescript
interface ApiError {
  code: string
  message: string
  statusCode: number
  details?: Record<string, any>
  timestamp: Date
}
```

## 定数型

### CalendarViewModes

カレンダービューモードの定数型です。

```typescript
const CALENDAR_VIEW_MODES = {
  MONTH: 'month',
  WEEK: 'week'
} as const

type CalendarViewModeKeys = keyof typeof CALENDAR_VIEW_MODES
type CalendarViewMode = typeof CALENDAR_VIEW_MODES[CalendarViewModeKeys]
```

### ApiErrorCodes

APIエラーコードの定数型です。

```typescript
const API_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const

type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES]
```
