---
仕様書: 実績日報
実績日報の仕様書: true
仕様書No.: ""
日本語名: 5. 定数・設定
---

# 定数・設定

## 概要

実績日報入力システムで使用する定数と設定値を定義します。これらの値はアプリケーション全体で一貫して使用され、設定変更時の影響を最小限に抑えるために一箇所で管理されます。

## 表示設定

### カレンダービューモード

```typescript
export const CALENDAR_VIEW_MODES = {
  MONTH: 'month',
  WEEK: 'week'
} as const

export type CalendarViewMode = typeof CALENDAR_VIEW_MODES[keyof typeof CALENDAR_VIEW_MODES]
```

### デフォルト表示設定

```typescript
export const DEFAULT_DISPLAY_SETTINGS = {
  // カレンダーのデフォルト表示モード
  DEFAULT_CALENDAR_VIEW: CALENDAR_VIEW_MODES.MONTH,

  // 1ページあたりの表示件数
  DEFAULT_PAGE_SIZE: 20,

  // 最大ページサイズ
  MAX_PAGE_SIZE: 100,

  // 日付フォーマット
  DATE_FORMAT: 'YYYY-MM-DD',
  DISPLAY_DATE_FORMAT: 'YYYY年MM月DD日',

  // 時間フォーマット
  TIME_FORMAT: 'HH:mm',
  DISPLAY_TIME_FORMAT: 'HH:mm',

  // 通貨フォーマット（拡張用）
  CURRENCY_FORMAT: '¥#,##0'
} as const
```

## API設定

### エンドポイント

```typescript
export const API_ENDPOINTS = {
  // 業務エントリ
  WORK_ENTRIES: '/api/work-entries',
  WORK_ENTRY_BY_ID: (id: string) => `/api/work-entries/${id}`,

  // 業務カテゴリ
  WORK_CATEGORIES: '/api/work-categories',
  WORK_CATEGORY_BY_ID: (id: string) => `/api/work-categories/${id}`,

  // 統計・レポート
  WORK_STATISTICS: '/api/work-entries/statistics',
  WORK_REPORTS: '/api/work-reports',

  // インポート・エクスポート
  WORK_ENTRIES_EXPORT: '/api/work-entries/export',
  WORK_ENTRIES_IMPORT: '/api/work-entries/import'
} as const
```

### API設定

```typescript
export const API_CONFIG = {
  // リクエスト設定
  TIMEOUT: 30000, // 30秒
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1秒

  // ページング設定
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // キャッシュ設定
  CACHE_TTL: 5 * 60 * 1000, // 5分
  STALE_WHILE_REVALIDATE: 30 * 1000, // 30秒

  // レート制限
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000 // 15分
} as const
```

## バリデーションルール

### 業務エントリバリデーション

```typescript
export const VALIDATION_RULES = {
  // テキストフィールド
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_TITLE_LENGTH: 1,

  // 数値フィールド
  MAX_WORK_HOURS: 24,
  MIN_WORK_HOURS: 0.5,
  WORK_HOURS_STEP: 0.5,

  // 日付関連
  MAX_PAST_DAYS: 365, // 1年前まで入力可能
  MAX_FUTURE_DAYS: 30, // 1ヶ月先まで入力可能

  // ファイルアップロード（拡張用）
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf']
} as const
```

### パスワードポリシー（拡張用）

```typescript
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBERS: true,
  REQUIRE_SYMBOLS: true,
  PREVENT_COMMON_PASSWORDS: true
} as const
```

## UI設定

### コンポーネントサイズ

```typescript
export const COMPONENT_SIZES = {
  // ボタンサイズ
  BUTTON_SIZES: {
    SM: 'sm',
    MD: 'md',
    LG: 'lg'
  } as const,

  // 入力フィールドサイズ
  INPUT_SIZES: {
    SM: 'sm',
    MD: 'md',
    LG: 'lg'
  } as const,

  // スペーシング
  SPACING: {
    XS: '0.25rem',
    SM: '0.5rem',
    MD: '1rem',
    LG: '1.5rem',
    XL: '2rem',
    XXL: '3rem'
  } as const
} as const
```

### アニメーション設定

```typescript
export const ANIMATION_CONFIG = {
  // トランジション時間
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  } as const,

  // イージング関数
  EASING: {
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_OUT: 'cubic-bezier(0.0, 0, 0.2, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    SHARP: 'cubic-bezier(0.4, 0, 0.6, 1)'
  } as const,

  // 遅延時間
  DELAY: {
    NONE: 0,
    SHORT: 100,
    MEDIUM: 200,
    LONG: 300
  } as const
} as const
```

### テーマ設定

```typescript
export const THEME_CONFIG = {
  // 色設定
  COLORS: {
    PRIMARY: '#0066cc',
    SECONDARY: '#666666',
    SUCCESS: '#28a745',
    WARNING: '#ffc107',
    ERROR: '#dc3545',
    INFO: '#17a2b8'
  } as const,

  // フォント設定
  FONTS: {
    PRIMARY: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    MONOSPACE: '"SF Mono", Monaco, "Cascadia Code", monospace'
  } as const,

  // フォントサイズ
  FONT_SIZES: {
    XS: '0.75rem',
    SM: '0.875rem',
    MD: '1rem',
    LG: '1.125rem',
    XL: '1.25rem',
    XXL: '1.5rem'
  } as const,

  // フォントウェイト
  FONT_WEIGHTS: {
    NORMAL: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700
  } as const,

  // 境界線設定
  BORDERS: {
    RADIUS: {
      SM: '0.25rem',
      MD: '0.375rem',
      LG: '0.5rem',
      XL: '0.75rem',
      FULL: '9999px'
    } as const,

    WIDTH: {
      THIN: '1px',
      MEDIUM: '2px',
      THICK: '3px'
    } as const
  } as const,

  // シャドウ設定
  SHADOWS: {
    SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  } as const
} as const
```

## 機能フラグ

### 機能有効化設定

```typescript
export const FEATURE_FLAGS = {
  // UI機能
  ENABLE_CALENDAR_WEEK_VIEW: true,
  ENABLE_WORK_ENTRY_EXPORT: true,
  ENABLE_BULK_OPERATIONS: false,
  ENABLE_ADVANCED_FILTERING: true,

  // API機能
  ENABLE_API_CACHING: true,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_REAL_TIME_UPDATES: false,

  // 実験的機能
  ENABLE_NEW_CALENDAR_COMPONENT: false,
  ENABLE_AI_ASSISTED_INPUT: false,
  ENABLE_VOICE_INPUT: false
} as const
```

## 国際化設定

### 言語設定

```typescript
export const I18N_CONFIG = {
  // サポート言語
  SUPPORTED_LANGUAGES: {
    JA: 'ja',
    EN: 'en'
  } as const,

  // デフォルト言語
  DEFAULT_LANGUAGE: 'ja',

  // 日付/時間フォーマット
  DATE_FORMATS: {
    JA: {
      DATE: 'YYYY年MM月DD日',
      TIME: 'HH:mm',
      DATETIME: 'YYYY年MM月DD日 HH:mm'
    },
    EN: {
      DATE: 'MMM DD, YYYY',
      TIME: 'HH:mm',
      DATETIME: 'MMM DD, YYYY HH:mm'
    }
  } as const
} as const
```

## パフォーマンス設定

### 最適化設定

```typescript
export const PERFORMANCE_CONFIG = {
  // デバウンス設定
  DEBOUNCE_DELAY: {
    SEARCH: 300,
    FORM_VALIDATION: 500,
    API_REQUEST: 100
  } as const,

  // 仮想スクロール設定
  VIRTUAL_SCROLL: {
    ITEM_HEIGHT: 60,
    CONTAINER_HEIGHT: 400,
    OVERSCAN: 5
  } as const,

  // 画像最適化
  IMAGE_OPTIMIZATION: {
    QUALITY: 80,
    SIZES: [320, 640, 1024, 1920],
    FORMATS: ['webp', 'jpg', 'png']
  } as const,

  // バンドル分割
  CODE_SPLITTING: {
    CHUNK_SIZE_WARNING: 500 * 1024, // 500KB
    CHUNK_SIZE_ERROR: 1000 * 1024    // 1MB
  } as const
} as const
```

## 環境別設定

### 環境変数マッピング

```typescript
export const ENVIRONMENT_CONFIG = {
  // API設定
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',

  // 機能フラグ
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
  ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',

  // 外部サービス
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID,
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // セキュリティ
  ENABLE_CSP: process.env.NODE_ENV === 'production',
  ENABLE_HTTPS_REDIRECT: process.env.NODE_ENV === 'production'
} as const
```

## ビジネスルール

### 業務ロジック定数

```typescript
export const BUSINESS_RULES = {
  // 勤務時間関連
  WORK_HOURS: {
    STANDARD_WORK_HOURS: 8,
    MAX_OVERTIME_HOURS: 4,
    BREAK_TIME_HOURS: 1
  } as const,

  // 休暇関連
  LEAVE_TYPES: {
    ANNUAL_LEAVE: 'annual_leave',
    SICK_LEAVE: 'sick_leave',
    SPECIAL_LEAVE: 'special_leave'
  } as const,

  // 承認ワークフロー
  APPROVAL_WORKFLOW: {
    REQUIRED_APPROVAL_HOURS: 8,
    AUTO_APPROVAL_LIMIT: 4,
    MANAGER_APPROVAL_LIMIT: 16
  } as const,

  // レポート設定
  REPORTING: {
    MONTHLY_REPORT_DEADLINE: 5, // 月初5日
    QUARTERLY_REPORT_DEADLINE: 10, // 四半期初10日
    YEARLY_REPORT_DEADLINE: 31 // 1月31日
  } as const
} as const
```

これらの定数設定により、アプリケーションの一貫性と保守性を確保します。
