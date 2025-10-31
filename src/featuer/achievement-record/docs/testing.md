---
仕様書: 実績日報
実績日報の仕様書: true
仕様書No.: ""
日本語名: 11. テスト戦略
---

# テスト戦略

## 概要

実績日報入力システムのテスト戦略は、品質保証と回帰テストの防止を目的として定義されています。テストは開発プロセスに統合され、継続的インテグレーション（CI）で自動実行されます。

## テストピラミッド

```
E2E Tests (少量)
    ↕️
Integration Tests (中量)
    ↕️
Unit Tests (大量)
```

### テストカバレッジ目標

- **ユニットテスト**: 80%以上
- **統合テスト**: 70%以上
- **E2Eテスト**: 主要ユーザーフロー60%以上
- **全体カバレッジ**: 75%以上

## ユニットテスト

### テスト対象

#### 1. フック関数

```typescript
// useWorkData.test.ts
describe('useWorkData', () => {
  it('should fetch work entries on mount', async () => {
    const mockApi = jest.fn()
    const { result } = renderHook(() => useWorkData(), {
      wrapper: createTestWrapper({ api: mockApi })
    })

    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledWith('/api/work-entries')
    })
  })

  it('should handle API errors gracefully', async () => {
    const mockApi = jest.fn().mockRejectedValue(new Error('API Error'))
    const { result } = renderHook(() => useWorkData(), {
      wrapper: createTestWrapper({ api: mockApi })
    })

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })
  })
})
```

#### 2. ユーティリティ関数

```typescript
// validators.test.ts
describe('validators', () => {
  describe('validateWorkEntry', () => {
    it('should return no errors for valid entry', () => {
      const validEntry = {
        title: 'Valid Title',
        hours: 2.5,
        date: '2024-01-15'
      }

      const errors = validateWorkEntry(validEntry)
      expect(errors).toEqual({})
    })

    it('should return error for empty title', () => {
      const invalidEntry = {
        title: '',
        hours: 2.5,
        date: '2024-01-15'
      }

      const errors = validateWorkEntry(invalidEntry)
      expect(errors.title).toBe('タイトルは必須です')
    })
  })
})
```

#### 3. バリデーション関数

```typescript
// dateUtils.test.ts
describe('dateUtils', () => {
  describe('formatDateForAPI', () => {
    it('should format Date object to YYYY-MM-DD string', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const result = formatDateForAPI(date)
      expect(result).toBe('2024-01-15')
    })
  })

  describe('isValidWorkDate', () => {
    it('should return true for future dates', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)
      expect(isValidWorkDate(futureDate)).toBe(true)
    })

    it('should return false for past dates more than 1 year ago', () => {
      const oldDate = new Date()
      oldDate.setFullYear(oldDate.getFullYear() - 2)
      expect(isValidWorkDate(oldDate)).toBe(false)
    })
  })
})
```

### テストユーティリティ

```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react'
import { AchievementRecordProvider } from '../context/AchievementRecordContext'

// カスタムレンダー関数
const customRender = (
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {}
) => {
  const AllTheProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
    return (
      <AchievementRecordProvider>
        {children}
      </AchievementRecordProvider>
    )
  }

  return render(ui, { wrapper: AllTheProviders, ...options })
}

// モックAPIレスポンス
export const mockWorkEntry = {
  id: 'work-1',
  title: 'Test Work',
  hours: 2.5,
  date: '2024-01-15',
  categoryId: 'meeting'
}

export const mockApiResponse = {
  data: [mockWorkEntry],
  success: true
}

// テストデータ生成ヘルパー
export const createMockWorkEntries = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockWorkEntry,
    id: `work-${i + 1}`,
    title: `Test Work ${i + 1}`
  }))
}
```

## 統合テスト

### コンポーネント統合テスト

```typescript
// Calendar.integration.test.tsx
describe('Calendar Component Integration', () => {
  it('should update selected date when clicking on calendar cell', async () => {
    const onDateSelect = jest.fn()
    render(
      <Calendar
        selectedDate={null}
        onDateSelect={onDateSelect}
      />
    )

    const dateCell = screen.getByText('15')
    fireEvent.click(dateCell)

    await waitFor(() => {
      expect(onDateSelect).toHaveBeenCalledWith(
        expect.any(Date) // 15日に対応するDateオブジェクト
      )
    })
  })

  it('should highlight selected date', () => {
    const selectedDate = new Date('2024-01-15')
    render(<Calendar selectedDate={selectedDate} />)

    const selectedCell = screen.getByText('15')
    expect(selectedCell).toHaveClass('selected')
  })
})
```

### API統合テスト

```typescript
// api.integration.test.ts
describe('API Integration', () => {
  const mockServer = setupServer(
    rest.get('/api/work-entries', (req, res, ctx) => {
      return res(ctx.json(mockApiResponse))
    }),
    rest.post('/api/work-entries', (req, res, ctx) => {
      return res(ctx.json({ data: mockWorkEntry, success: true }))
    })
  )

  beforeAll(() => mockServer.listen())
  afterEach(() => mockServer.resetHandlers())
  afterAll(() => mockServer.close())

  it('should fetch work entries from API', async () => {
    const result = await workApi.getWorkEntries()
    expect(result).toEqual(mockApiResponse.data)
  })

  it('should create work entry via API', async () => {
    const newEntry = {
      title: 'New Work',
      hours: 3.0,
      date: '2024-01-16',
      categoryId: 'development'
    }

    const result = await workApi.createWorkEntry(newEntry)
    expect(result).toEqual(mockWorkEntry)
  })
})
```

### Context統合テスト

```typescript
// AchievementRecordProvider.integration.test.tsx
describe('AchievementRecordProvider Integration', () => {
  it('should provide work entries to child components', async () => {
    const TestComponent = () => {
      const { workEntries, isLoading } = useAchievementRecord()
      return (
        <div>
          {isLoading ? 'Loading...' : `Loaded ${workEntries.length} entries`}
        </div>
      )
    }

    render(
      <AchievementRecordProvider>
        <TestComponent />
      </AchievementRecordProvider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Loaded 3 entries')).toBeInTheDocument()
    })
  })
})
```

## E2Eテスト

### ユーザーフローシナリオ

#### 業務入力フローテスト

```typescript
// work-entry-flow.e2e.test.ts
describe('Work Entry Creation Flow', () => {
  it('should allow user to create a new work entry', () => {
    // ログインテスト
    cy.visit('/achievement-record')
    cy.get('[data-cy="login-button"]').click()
    cy.get('[data-cy="email-input"]').type('user@example.com')
    cy.get('[data-cy="password-input"]').type('password')
    cy.get('[data-cy="submit-login"]').click()

    // カレンダーから日付選択
    cy.get('[data-cy="calendar"]').should('be.visible')
    cy.get('[data-cy="date-2024-01-15"]').click()

    // 業務入力フォーム表示確認
    cy.get('[data-cy="work-form"]').should('be.visible')

    // フォーム入力
    cy.get('[data-cy="title-input"]').type('プロジェクトミーティング')
    cy.get('[data-cy="hours-input"]').type('2.5')
    cy.get('[data-cy="description-input"]').type('進捗確認と次週計画')
    cy.get('[data-cy="category-select"]').select('meeting')

    // 保存実行
    cy.get('[data-cy="save-button"]').click()

    // 成功メッセージ確認
    cy.get('[data-cy="success-message"]').should('contain', '業務が保存されました')

    // 一覧に新しいエントリが表示されることを確認
    cy.get('[data-cy="work-list"]').should('contain', 'プロジェクトミーティング')
    cy.get('[data-cy="work-list"]').should('contain', '2.5時間')
  })
})
```

#### データ編集フローテスト

```typescript
// work-entry-edit-flow.e2e.test.ts
describe('Work Entry Edit Flow', () => {
  it('should allow user to edit existing work entry', () => {
    // 既存の業務エントリがある状態でテスト開始
    cy.visit('/achievement-record')

    // 編集ボタンクリック
    cy.get('[data-cy="work-item-1"]').find('[data-cy="edit-button"]').click()

    // フォームが編集モードで開くことを確認
    cy.get('[data-cy="title-input"]').should('have.value', '会議参加')

    // 内容を変更
    cy.get('[data-cy="title-input"]').clear().type('プロジェクトミーティング')
    cy.get('[data-cy="hours-input"]').clear().type('3.0')

    // 保存
    cy.get('[data-cy="save-button"]').click()

    // 変更が反映されていることを確認
    cy.get('[data-cy="work-list"]').should('contain', 'プロジェクトミーティング')
    cy.get('[data-cy="work-list"]').should('contain', '3.0時間')
  })
})
```

## テスト実行とCI/CD

### テストスクリプト

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:ui": "cypress open",
    "test:ci": "npm run test && npm run test:e2e"
  }
}
```

### CI/CD設定例 (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## テストデータ管理

### テストデータ生成

```typescript
// test-data-generator.ts
export const generateTestWorkEntries = (count: number = 10) => {
  const categories = ['meeting', 'development', 'review', 'planning']
  const titles = [
    'プロジェクトミーティング',
    'コードレビュー',
    '機能開発',
    '設計検討',
    'テスト実施'
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: `work-${i + 1}`,
    title: titles[i % titles.length],
    description: `テスト用の業務内容 ${i + 1}`,
    hours: Math.random() * 8 + 0.5, // 0.5-8.5時間
    date: new Date(2024, 0, i % 28 + 1).toISOString().split('T')[0],
    categoryId: categories[i % categories.length],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))
}
```

### モックサーバー設定

```typescript
// mocks/server.ts
import { setupServer } from 'msw/node'
import { rest } from 'msw'

export const server = setupServer(
  rest.get('/api/work-entries', (req, res, ctx) => {
    const entries = generateTestWorkEntries(20)
    return res(ctx.json({ data: entries, success: true }))
  }),

  rest.post('/api/work-entries', (req, res, ctx) => {
    const newEntry = {
      id: 'work-new',
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return res(ctx.json({ data: newEntry, success: true }))
  })
)
```

## パフォーマンステスト

### コンポーネントパフォーマンステスト

```typescript
// WorkList.performance.test.tsx
describe('WorkList Performance', () => {
  it('should render large list efficiently', () => {
    const largeDataSet = generateTestWorkEntries(1000)

    const { rerender, unmount } = render(<WorkList entries={largeDataSet} />)

    // 初期レンダリング時間を測定
    const startTime = performance.now()
    rerender(<WorkList entries={largeDataSet} />)
    const endTime = performance.now()

    expect(endTime - startTime).toBeLessThan(100) // 100ms以内

    unmount()
  })
})
```

## アクセシビリティテスト

### a11yテスト

```typescript
// Calendar.a11y.test.tsx
describe('Calendar Accessibility', () => {
  it('should have proper ARIA labels', () => {
    render(<Calendar />)

    // カレンダーに適切なラベルがあることを確認
    expect(screen.getByRole('grid')).toHaveAttribute('aria-label', 'カレンダー')
    expect(screen.getAllByRole('gridcell')).toHaveLength.greaterThan(0)
  })

  it('should be keyboard navigable', () => {
    render(<Calendar />)

    const firstDateCell = screen.getAllByRole('gridcell')[0]

    // Tabでフォーカスできることを確認
    userEvent.tab()
    expect(firstDateCell).toHaveFocus()

    // 矢印キーで移動できることを確認
    userEvent.keyboard('{arrowRight}')
    const nextCell = screen.getAllByRole('gridcell')[1]
    expect(nextCell).toHaveFocus()
  })
})
```

## テストレポートと品質ゲート

### カバレッジレポート

```typescript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/**/*.stories.tsx'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
}
```

### 品質ゲート設定

- **カバレッジ閾値**: 80% (branches, functions, lines, statements)
- **テスト成功率**: 100%
- **パフォーマンス予算**: 最初の描画3秒以内、インタラクション100ms以内
- **アクセシビリティスコア**: Lighthouse 90点以上

このテスト戦略により、高品質で信頼性の高い実績日報入力システムを実現します。
