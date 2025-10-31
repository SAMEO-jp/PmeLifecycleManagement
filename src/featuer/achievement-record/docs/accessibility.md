---
仕様書: 実績日報
実績日報の仕様書: true
日本語名: 10. アクセシビリティ対応
---
---
仕様書: 実績日報
実績日報の仕様書: true
仕様書No.: ""
---

# アクセシビリティ対応

## 概要

実績日報入力システムのアクセシビリティ対応は、[WCAG 2.1 AA](https://www.w3.org/TR/WCAG21/)準拠を目標とし、多様なユーザーが快適に利用できるように設計されています。キーボード操作、スクリーンリーダー、支援技術との互換性を確保します。

## 準拠レベル

- **WCAG 2.1 AA準拠**を目標
- **Section 508**対応（米国政府調達品基準）
- **日本工業規格 JIS X 8341-3:2016**対応

## キーボード操作

### 基本操作

すべてのインタラクティブ要素はキーボードで操作可能：

```typescript
// カレンダーコンポーネントのキーボード操作
const Calendar = ({ selectedDate, onDateSelect }: CalendarProps) => {
  const [focusedDate, setFocusedDate] = useState(selectedDate || new Date())

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        setFocusedDate(prev => addDays(prev, -1))
        break
      case 'ArrowRight':
        setFocusedDate(prev => addDays(prev, 1))
        break
      case 'ArrowUp':
        setFocusedDate(prev => addDays(prev, -7))
        break
      case 'ArrowDown':
        setFocusedDate(prev => addDays(prev, 7))
        break
      case 'Enter':
      case ' ':
        onDateSelect(focusedDate)
        event.preventDefault()
        break
      case 'Escape':
        // フォーカスを外す
        (event.target as HTMLElement).blur()
        break
    }
  }

  return (
    <div
      role="grid"
      aria-label="日付選択カレンダー"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* カレンダーグリッド */}
    </div>
  )
}
```

### フォーカス管理

```typescript
// モーダル表示時のフォーカス管理
const useFocusTrap = (isOpen: boolean) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedElement = useRef<Element | null>(null)

  useEffect(() => {
    if (isOpen) {
      // モーダルを開く前のフォーカス要素を保存
      previouslyFocusedElement.current = document.activeElement

      // モーダル内の最初のフォーカス可能な要素にフォーカス
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )

      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus()
      }
    } else {
      // モーダルを閉じる時に元のフォーカスを戻す
      if (previouslyFocusedElement.current) {
        (previouslyFocusedElement.current as HTMLElement).focus()
      }
    }
  }, [isOpen])

  // Tabキーでのフォーカス循環
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (event.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus()
            event.preventDefault()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus()
            event.preventDefault()
          }
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return modalRef
}
```

## スクリーンリーダー対応

### ARIA属性の適切な使用

```typescript
// 業務入力フォームのARIA対応
const WorkEntryForm = () => {
  const [errors, setErrors] = useState<FormErrors>({})

  return (
    <form
      role="form"
      aria-labelledby="form-title"
      aria-describedby="form-description"
    >
      <h2 id="form-title">業務実績入力</h2>
      <p id="form-description">
        日々の業務内容と時間を入力してください。
      </p>

      <div>
        <label htmlFor="title-input">業務タイトル</label>
        <input
          id="title-input"
          type="text"
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
        />
        {errors.title && (
          <span id="title-error" role="alert" className="error">
            {errors.title}
          </span>
        )}
      </div>

      <div>
        <label htmlFor="hours-input">作業時間（時間）</label>
        <input
          id="hours-input"
          type="number"
          min="0.5"
          max="24"
          step="0.5"
          aria-required="true"
          aria-invalid={!!errors.hours}
        />
        <span aria-live="polite">
          作業時間は0.5から24時間の範囲で入力してください
        </span>
      </div>

      <button
        type="submit"
        aria-disabled={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? '保存中...' : '保存'}
      </button>
    </form>
  )
}
```

### ライブリージョンの使用

```typescript
// リアルタイムフィードバック
const WorkEntryForm = () => {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  const handleSubmit = async (data: WorkEntryData) => {
    setSaveStatus('saving')

    try {
      await saveWorkEntry(data)
      setSaveStatus('success')
      // 成功メッセージは自動的に読み上げられる
    } catch (error) {
      setSaveStatus('error')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* フォーム要素 */}
      </form>

      {/* ステータスメッセージ */}
      <div aria-live="polite" aria-atomic="true">
        {saveStatus === 'saving' && <p>データを保存しています...</p>}
        {saveStatus === 'success' && <p>業務実績が保存されました。</p>}
        {saveStatus === 'error' && <p>保存に失敗しました。再度お試しください。</p>}
      </div>
    </div>
  )
}
```

### セマンティックHTML

```typescript
// 業務一覧のセマンティック構造
const WorkList = ({ entries }: WorkListProps) => {
  return (
    <section aria-labelledby="work-list-heading">
      <h2 id="work-list-heading">業務実績一覧</h2>

      <div role="table" aria-label="業務実績一覧">
        <div role="rowgroup">
          <div role="row">
            <span role="columnheader">日付</span>
            <span role="columnheader">業務内容</span>
            <span role="columnheader">時間</span>
            <span role="columnheader">操作</span>
          </div>
        </div>

        <div role="rowgroup">
          {entries.map(entry => (
            <div key={entry.id} role="row">
              <span role="cell">
                <time dateTime={entry.date.toISOString()}>
                  {formatDate(entry.date)}
                </time>
              </span>
              <span role="cell">{entry.title}</span>
              <span role="cell">{entry.hours}時間</span>
              <span role="cell">
                <button
                  type="button"
                  aria-label={`${entry.title}を編集`}
                  onClick={() => onEdit(entry)}
                >
                  編集
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>

      {entries.length === 0 && (
        <p role="status">表示する業務実績がありません。</p>
      )}
    </section>
  )
}
```

## 視覚支援

### コントラスト比

```scss
// 十分なコントラスト比を確保したCSS変数
:root {
  --color-text-primary: #1a1a1a;     // 背景色#ffffffに対するコントラスト比: 18.1:1
  --color-text-secondary: #666666;   // 背景色#ffffffに対するコントラスト比: 5.9:1
  --color-border: #cccccc;           // 背景色#ffffffに対するコントラスト比: 2.3:1
  --color-focus: #0066cc;            // フォーカスインジケーター
  --color-error: #cc0000;            // エラーメッセージ
  --color-success: #008800;          // 成功メッセージ
}

// 高コントラストモード対応
@media (prefers-contrast: high) {
  :root {
    --color-text-primary: #000000;
    --color-text-secondary: #333333;
    --color-border: #000000;
  }
}
```

### フォントサイズと行間

```scss
// 読みやすいフォント設定
.work-form {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 16px;        // 最小16px（モバイルでのズーム防止）
  line-height: 1.5;       // 適切な行間
  letter-spacing: 0.01em; // 文字間隔

  // フォントサイズ拡大対応
  @media (prefers-reduced-motion: reduce) {
    font-size: clamp(14px, 2vw, 18px);
  }
}

// 見出しの階層構造
.work-section {
  h1 { font-size: 2rem; margin-bottom: 1.5rem; }
  h2 { font-size: 1.5rem; margin-bottom: 1.25rem; }
  h3 { font-size: 1.25rem; margin-bottom: 1rem; }
  h4 { font-size: 1.125rem; margin-bottom: 0.875rem; }
}
```

### 色覚異常対応

```typescript
// 色だけでなく形状やパターンを組み合わせた表現
const StatusIndicator = ({ status }: { status: 'success' | 'error' | 'warning' }) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'success':
        return {
          icon: '✓',
          color: '#28a745',
          text: '成功',
          pattern: 'solid'
        }
      case 'error':
        return {
          icon: '✕',
          color: '#dc3545',
          text: 'エラー',
          pattern: 'diagonal'
        }
      case 'warning':
        return {
          icon: '!',
          color: '#ffc107',
          text: '警告',
          pattern: 'striped'
        }
      default:
        return { icon: '?', color: '#6c757d', text: '不明' }
    }
  }

  const statusInfo = getStatusInfo(status)

  return (
    <div
      className={`status-indicator status-${status}`}
      style={{
        color: statusInfo.color,
        backgroundImage: getPattern(statusInfo.pattern)
      }}
      role="status"
      aria-label={`${statusInfo.text}状態`}
    >
      <span aria-hidden="true">{statusInfo.icon}</span>
      <span className="sr-only">{statusInfo.text}</span>
    </div>
  )
}
```

## モーションとアニメーション

### モーション減衰設定の尊重

```typescript
// prefers-reduced-motionの考慮
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// アニメーションコンポーネント
const FadeIn = ({ children, duration = 300 }: FadeInProps) => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      style={{
        animation: prefersReducedMotion
          ? 'none'
          : `fadeIn ${duration}ms ease-in-out`
      }}
    >
      {children}
    </div>
  )
}
```

### フォーカスインジケーター

```scss
// 明確なフォーカスインジケーター
*:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

// 高コントラスト時のフォーカス
@media (prefers-contrast: high) {
  *:focus {
    outline: 3px solid #000000;
    outline-offset: 1px;
  }
}

// キーボード操作時のみのフォーカス表示
.keyboard-navigation *:focus {
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.5);
}
```

## 支援技術のテスト

### 自動テスト

```typescript
// axe-coreを使用したアクセシビリティテスト
import axe from 'axe-core'

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<WorkEntryForm />)

    const results = await axe.run(container)

    expect(results.violations).toHaveLength(0)
  })

  it('should support keyboard navigation', () => {
    render(<Calendar />)

    // Tabでカレンダーにフォーカス
    userEvent.tab()
    expect(screen.getByRole('grid')).toHaveFocus()

    // 矢印キーで日付移動
    userEvent.keyboard('{arrowRight}')
    // フォーカスが移動していることを確認
  })
})
```

### Lighthouseアクセシビリティ監査

```javascript
// Lighthouse CI設定
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/achievement-record'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }]
      }
    }
  }
}
```

## 言語と地域化

### 言語属性の設定

```typescript
// HTMLのlang属性設定
const App = () => {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <title>実績日報入力システム</title>
      </head>
      <body>
        {/* アプリケーションコンテンツ */}
      </body>
    </html>
  )
}
```

### テキストの代替表現

```typescript
// アイコンの代替テキスト
const ActionButton = ({ icon, label, onClick }: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label} // ツールチップとしても表示
    >
      <Icon name={icon} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </button>
  )
}

// 画像のalt属性
const UserAvatar = ({ user, size = 'medium' }: UserAvatarProps) => {
  const altText = user.displayName
    ? `${user.displayName}のアバター`
    : 'ユーザーアバター'

  return (
    <img
      src={user.avatarUrl || '/default-avatar.png'}
      alt={altText}
      width={size === 'small' ? 32 : size === 'large' ? 64 : 48}
      height={size === 'small' ? 32 : size === 'large' ? 64 : 48}
    />
  )
}
```

## ドキュメントとサポート

### アクセシビリティステートメント

```markdown
# アクセシビリティステートメント

実績日報入力システムは、WCAG 2.1 AA準拠を目指して開発されています。

## 対応状況

### 対応済み
- キーボード操作の完全対応
- スクリーンリーダー対応
- 高コントラスト対応
- フォントサイズ拡大対応

### 制限事項
- 一部の複雑なチャートは、代替テキストでのみ情報提供

### お問い合わせ
アクセシビリティに関するご質問は、support@example.comまでお問い合わせください。
```

### ユーザーガイド

```typescript
// ヘルプ機能の実装
const AccessibilityHelp = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="アクセシビリティヘルプ"
        className="accessibility-help-button"
      >
        ?
      </button>

      <dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="help-title"
      >
        <h2 id="help-title">キーボード操作ガイド</h2>
        <ul>
          <li><kbd>Tab</kbd> / <kbd>Shift+Tab</kbd>: フォーカス移動</li>
          <li><kbd>Enter</kbd> / <kbd>Space</kbd>: ボタン実行</li>
          <li><kbd>Escape</kbd>: キャンセル・閉じる</li>
          <li><kbd>矢印キー</kbd>: カレンダー操作</li>
        </ul>
      </dialog>
    </>
  )
}
```

このアクセシビリティ対応により、多様なユーザーが快適にシステムを利用できるようになります。
