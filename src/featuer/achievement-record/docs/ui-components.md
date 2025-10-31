---
仕様書: 実績日報
実績日報の仕様書: true
仕様書No.: ""
日本語名: 8. UIコンポーネント設計
---

# UIコンポーネント設計

## 概要

実績日報入力システムのUIコンポーネントは、shadcn/uiをベースとしたデザインシステムを採用し、一貫性のあるユーザー体験を提供します。各コンポーネントはアクセシビリティ、レスポンシブデザイン、再利用性を考慮して設計されています。

## コンポーネント階層

```
App (Root)
├── AchievementRecordContainer (Main Container)
│   ├── SidebarContainer
│   │   ├── Calendar
│   │   └── ActionButtons
│   ├── ContentContainer
│   │   ├── WorkList
│   │   └── WorkFilters
│   └── DetailContainer
│       └── WorkEntryForm
└── Shared Components (Dialog, Toast, etc.)
```

## UIコンポーネント

### 1. Calendar (カレンダー)

#### 概要
日付選択と表示を担当するメインカレンダーコンポーネントです。

#### Propsインターフェース

```typescript
interface CalendarProps {
  /** 選択されている日付 */
  selectedDate?: Date

  /** 表示モード */
  viewMode?: 'month' | 'week'

  /** 日付選択時のコールバック */
  onDateSelect?: (date: Date) => void

  /** 表示モード変更時のコールバック */
  onViewModeChange?: (mode: 'month' | 'week') => void

  /** 強調表示する日付リスト */
  highlightedDates?: Date[]

  /** 無効化する日付リスト */
  disabledDates?: Date[]

  /** カスタムCSSクラス */
  className?: string

  /** 最小選択可能日付 */
  minDate?: Date

  /** 最大選択可能日付 */
  maxDate?: Date
}
```

#### 機能仕様

```typescript
const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  viewMode = 'month',
  onDateSelect,
  onViewModeChange,
  highlightedDates = [],
  disabledDates = [],
  className,
  minDate,
  maxDate
}) => {
  // 月表示/週表示の切り替えロジック
  const [currentView, setCurrentView] = useState(viewMode)

  // 日付クリックハンドラー
  const handleDateClick = useCallback((date: Date) => {
    if (isDateDisabled(date)) return
    onDateSelect?.(date)
  }, [onDateSelect])

  // キーボードナビゲーション
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // 矢印キーでの日付移動
    // Enterキーでの選択
    // Escapeキーでのキャンセル
  }, [])

  return (
    <div
      className={cn('calendar', className)}
      role="grid"
      aria-label="日付選択カレンダー"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <CalendarHeader
        currentMonth={currentMonth}
        viewMode={currentView}
        onViewModeChange={setCurrentView}
        onMonthChange={handleMonthChange}
      />
      <CalendarGrid
        dates={calendarDates}
        selectedDate={selectedDate}
        highlightedDates={highlightedDates}
        disabledDates={disabledDates}
        onDateClick={handleDateClick}
      />
    </div>
  )
}
```

#### アクセシビリティ対応

- **キーボード操作**: Tab/矢印キー/Enter/Space対応
- **スクリーンリーダー**: 適切なARIAラベルとランドマーク
- **フォーカス管理**: 明確なフォーカスインジケーター
- **ライブリージョン**: 選択状態の変更通知

### 2. WorkEntryForm (業務入力フォーム)

#### 概要
業務実績の入力・編集を行うフォームコンポーネントです。

#### Propsインターフェース

```typescript
interface WorkEntryFormProps {
  /** 初期データ（編集時） */
  initialData?: Partial<WorkEntryFormData>

  /** 業務カテゴリリスト */
  categories: WorkCategory[]

  /** 保存成功時のコールバック */
  onSubmit: (data: WorkEntryCreateRequest) => Promise<void>

  /** キャンセル時のコールバック */
  onCancel?: () => void

  /** 送信中状態 */
  isSubmitting?: boolean

  /** フォームモード */
  mode?: 'create' | 'edit'

  /** カスタムCSSクラス */
  className?: string
}
```

#### 機能仕様

```typescript
const WorkEntryForm: React.FC<WorkEntryFormProps> = ({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode = 'create',
  className
}) => {
  // フォーム状態管理
  const {
    formData,
    errors,
    isValid,
    isDirty,
    handleChange,
    handleSubmit,
    reset
  } = useWorkForm({
    initialData,
    onSubmit: async (data) => {
      await onSubmit(data)
      if (mode === 'create') reset()
    }
  })

  // リアルタイムバリデーション
  useEffect(() => {
    validateField('title', formData.title)
    validateField('hours', formData.hours)
  }, [formData.title, formData.hours])

  return (
    <form
      className={cn('work-entry-form', className)}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="form-section">
        <h3>基本情報</h3>

        <FormField label="業務タイトル" required error={errors.title}>
          <Input
            name="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="会議参加、コードレビューなど"
            maxLength={VALIDATION_RULES.MAX_TITLE_LENGTH}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
        </FormField>

        <FormField label="作業時間" required error={errors.hours}>
          <Input
            name="hours"
            type="number"
            value={formData.hours}
            onChange={(e) => handleChange('hours', e.target.value)}
            placeholder="2.5"
            min="0.5"
            max={VALIDATION_RULES.MAX_WORK_HOURS.toString()}
            step="0.5"
          />
          <span className="input-unit">時間</span>
        </FormField>
      </div>

      <div className="form-section">
        <h3>詳細情報</h3>

        <FormField label="業務カテゴリ" required error={errors.categoryId}>
          <Select
            name="categoryId"
            value={formData.categoryId}
            onValueChange={(value) => handleChange('categoryId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="category-option">
                    <div
                      className="category-color"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="詳細説明" error={errors.description}>
          <Textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="業務内容の詳細を入力してください"
            maxLength={VALIDATION_RULES.MAX_DESCRIPTION_LENGTH}
            rows={4}
          />
          <div className="character-count">
            {formData.description.length}/{VALIDATION_RULES.MAX_DESCRIPTION_LENGTH}
          </div>
        </FormField>
      </div>

      <FormActions>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting || !isDirty}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />
              保存中...
            </>
          ) : mode === 'create' ? (
            '保存'
          ) : (
            '更新'
          )}
        </Button>
      </FormActions>
    </form>
  )
}
```

### 3. WorkList (業務一覧)

#### 概要
業務実績の一覧表示と管理を行うコンポーネントです。

#### Propsインターフェース

```typescript
interface WorkListProps {
  /** 業務エントリリスト */
  entries: WorkEntry[]

  /** 業務カテゴリリスト */
  categories: WorkCategory[]

  /** 編集時のコールバック */
  onEdit?: (entry: WorkEntry) => void

  /** 削除時のコールバック */
  onDelete?: (entry: WorkEntry) => Promise<void>

  /** 選択時のコールバック */
  onSelect?: (entry: WorkEntry) => void

  /** 選択されているエントリID */
  selectedId?: string

  /** 読み込み中状態 */
  isLoading?: boolean

  /** 空状態のメッセージ */
  emptyMessage?: string

  /** カスタムCSSクラス */
  className?: string
}
```

#### 機能仕様

```typescript
const WorkList: React.FC<WorkListProps> = ({
  entries,
  categories,
  onEdit,
  onDelete,
  onSelect,
  selectedId,
  isLoading = false,
  emptyMessage = "表示する業務実績がありません。",
  className
}) => {
  // カテゴリマップ作成
  const categoryMap = useMemo(() => {
    return categories.reduce((map, category) => {
      map[category.id] = category
      return map
    }, {} as Record<string, WorkCategory>)
  }, [categories])

  // フィルタリング・ソート
  const [filters, setFilters] = useState<WorkFilters>({})
  const [sortBy, setSortBy] = useState<SortField>('date')
  const [sortOrder, setSortOrder] = useState<SortDirection>('desc')

  const filteredAndSortedEntries = useMemo(() => {
    let filtered = entries.filter(entry => {
      // 日付フィルター
      if (filters.startDate && entry.date < filters.startDate) return false
      if (filters.endDate && entry.date > filters.endDate) return false

      // カテゴリフィルター
      if (filters.categoryId && entry.categoryId !== filters.categoryId) return false

      // 検索フィルター
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        return entry.title.toLowerCase().includes(query) ||
               entry.description?.toLowerCase().includes(query)
      }

      return true
    })

    // ソート
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime()
          break
        case 'hours':
          comparison = a.hours - b.hours
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [entries, filters, sortBy, sortOrder])

  if (isLoading) {
    return <WorkListSkeleton />
  }

  if (filteredAndSortedEntries.length === 0) {
    return (
      <EmptyState
        icon={<WorkIcon />}
        title="業務実績がありません"
        description={emptyMessage}
      />
    )
  }

  return (
    <div className={cn('work-list', className)}>
      <WorkListHeader
        filters={filters}
        onFiltersChange={setFilters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(field, order) => {
          setSortBy(field)
          setSortOrder(order)
        }}
      />

      <div className="work-list-content" role="table" aria-label="業務実績一覧">
        <div role="rowgroup">
          <div role="row" className="work-list-header-row">
            <div role="columnheader">日付</div>
            <div role="columnheader">業務内容</div>
            <div role="columnheader">時間</div>
            <div role="columnheader">カテゴリ</div>
            <div role="columnheader">操作</div>
          </div>
        </div>

        <div role="rowgroup">
          {filteredAndSortedEntries.map(entry => (
            <WorkListItem
              key={entry.id}
              entry={entry}
              category={categoryMap[entry.categoryId]}
              isSelected={entry.id === selectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      <WorkListPagination
        currentPage={filters.page || 1}
        totalPages={Math.ceil(filteredAndSortedEntries.length / PAGE_SIZE)}
        onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
      />
    </div>
  )
}
```

## コンテナコンポーネント

### 1. AchievementRecordContainer

#### 概要
実績日報入力システム全体のレイアウトと状態管理を担当するルートコンテナです。

#### 機能仕様

```typescript
const AchievementRecordContainer: React.FC = () => {
  // Provider統合
  return (
    <AchievementRecordProvider>
      <ApiProvider>
        <SelectionProvider>
          <DataProvider>
            <ErrorBoundary>
              <div className="achievement-record-layout">
                <AchievementRecordHeader />
                <div className="main-content">
                  <SidebarContainer />
                  <ContentContainer />
                  <DetailContainer />
                </div>
              </div>
            </ErrorBoundary>
          </DataProvider>
        </SelectionProvider>
      </ApiProvider>
    </AchievementRecordProvider>
  )
}
```

### 2. SidebarContainer

#### 概要
左サイドバーのコンテンツを管理するコンテナです。

```typescript
const SidebarContainer: React.FC = () => {
  const { selectedDate, selectDate, viewMode, changeViewMode } = useSelection()

  return (
    <aside className="sidebar" aria-label="ナビゲーションサイドバー">
      <Calendar
        selectedDate={selectedDate}
        viewMode={viewMode}
        onDateSelect={selectDate}
        onViewModeChange={changeViewMode}
      />

      <ActionButtons />
    </aside>
  )
}
```

### 3. ContentContainer

#### 概要
メインコンテンツエリアを管理するコンテナです。

```typescript
const ContentContainer: React.FC = () => {
  const { workEntries, categories, isLoading } = useAchievementRecord()
  const { selectedDate } = useSelection()

  // 選択された日付の業務エントリをフィルタリング
  const filteredEntries = useMemo(() => {
    if (!selectedDate) return workEntries

    return workEntries.filter(entry =>
      isSameDay(entry.date, selectedDate)
    )
  }, [workEntries, selectedDate])

  return (
    <main className="content-area" aria-label="メインコンテンツ">
      <WorkList
        entries={filteredEntries}
        categories={categories}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSelect={handleSelect}
      />
    </main>
  )
}
```

## 共有コンポーネント

### FormField

#### 概要
フォームフィールドの統一的なレイアウトを提供するコンポーネントです。

```typescript
interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  hint,
  children,
  className
}) => {
  const fieldId = useId()
  const errorId = error ? `${fieldId}-error` : undefined
  const hintId = hint ? `${fieldId}-hint` : undefined

  return (
    <div className={cn('form-field', { 'has-error': !!error }, className)}>
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && <span className="required-indicator" aria-label="必須">*</span>}
      </label>

      <div className="form-control">
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          'aria-invalid': !!error,
          'aria-describedby': [errorId, hintId].filter(Boolean).join(' ') || undefined
        })}
      </div>

      {error && (
        <div id={errorId} className="form-error" role="alert">
          {error}
        </div>
      )}

      {hint && !error && (
        <div id={hintId} className="form-hint">
          {hint}
        </div>
      )}
    </div>
  )
}
```

### Loading States

#### 概要
さまざまな読み込み状態に対応したローディングコンポーネントです。

```typescript
// スケルトンローディング
const WorkListSkeleton: React.FC = () => (
  <div className="work-list-skeleton" aria-label="読み込み中">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="skeleton-item">
        <Skeleton className="skeleton-date" />
        <Skeleton className="skeleton-title" />
        <Skeleton className="skeleton-hours" />
        <Skeleton className="skeleton-actions" />
      </div>
    ))}
  </div>
)

// インラインスピナー
const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => (
  <div
    className={cn('spinner', `spinner-${size}`)}
    role="status"
    aria-label="読み込み中"
  >
    <div className="spinner-inner" />
  </div>
)

// 全画面ローディング
const PageLoader: React.FC = () => (
  <div className="page-loader" role="status" aria-label="ページを読み込み中">
    <div className="loader-content">
      <Spinner size="lg" />
      <p>読み込み中...</p>
    </div>
  </div>
)
```

## レスポンシブデザイン

### ブレークポイント

```scss
// CSSカスタムプロパティ
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}

// メディアクエリ
.achievement-record-layout {
  display: grid;
  grid-template-columns: 300px 1fr 400px;
  gap: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: 250px 1fr;
    .detail-container { display: none; }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    .sidebar { display: none; }
  }
}
```

### モバイル対応

```typescript
// モバイルメニュー
const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="mobile-menu-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="メニューを開く"
      >
        <MenuIcon />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left">
          <SidebarContainer />
        </SheetContent>
      </Sheet>
    </>
  )
}
```

このUIコンポーネント設計により、一貫性があり、使いやすく、保守性の高いユーザーインターフェースを実現します。
