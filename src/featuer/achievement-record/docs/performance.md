---
仕様書: 実績日報
実績日報の仕様書: true
仕様書No.: ""
日本語名: 9. パフォーマンス最適化
---

# パフォーマンス最適化

## 概要

実績日報入力システムのパフォーマンス最適化戦略は、ユーザーの応答性とシステムのスケーラビリティを確保することを目的としています。最適化は多層的に実施され、継続的な監視と改善を行います。

## パフォーマンス目標

### ユーザー体験指標 (UX Metrics)

- **First Contentful Paint (FCP)**: 1.5秒以内
- **Largest Contentful Paint (LCP)**: 2.5秒以内
- **First Input Delay (FID)**: 100ms以内
- **Cumulative Layout Shift (CLS)**: 0.1以内

### システムパフォーマンス指標

- **APIレスポンスタイム**: 200ms以内 (P95)
- **Time to Interactive**: 3秒以内
- **Bundle Size**: 500KB以内 (gzip圧縮後)
- **メモリ使用量**: 100MB以内

## データ取得の最適化

### ページング実装

```typescript
// 効率的なページングフック
const usePaginatedWorkEntries = (pageSize: number = 20) => {
  const [page, setPage] = useState(1)
  const [allEntries, setAllEntries] = useState<WorkEntry[]>([])
  const [hasMore, setHasMore] = useState(true)

  const loadMore = useCallback(async () => {
    if (!hasMore) return

    const response = await workApi.getWorkEntries({
      page,
      limit: pageSize,
      sortBy: 'date',
      sortOrder: 'desc'
    })

    if (response.data.length < pageSize) {
      setHasMore(false)
    }

    setAllEntries(prev => [...prev, ...response.data])
    setPage(prev => prev + 1)
  }, [page, pageSize, hasMore])

  return { entries: allEntries, loadMore, hasMore }
}
```

### キャッシュ戦略

#### React Queryを使用したキャッシュ

```typescript
// キャッシュ設定
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5分
      cacheTime: 10 * 60 * 1000, // 10分
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // ネットワークエラー時はリトライ
        if (error instanceof NetworkError) {
          return failureCount < 3
        }
        return false
      }
    }
  }
})

// 業務データ取得フック
export const useWorkEntries = (filters: WorkFilters) => {
  return useQuery({
    queryKey: ['work-entries', filters],
    queryFn: () => workApi.getWorkEntries(filters),
    select: (data) => data.data,
    keepPreviousData: true
  })
}
```

#### Service Workerキャッシュ

```typescript
// service-worker.js
const CACHE_NAME = 'work-entries-v1'
const API_CACHE_NAME = 'api-cache-v1'

const API_ROUTES_TO_CACHE = [
  '/api/work-categories',
  '/api/work-entries/recent'
]

// インストール時
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/static/js/bundle.js',
        '/static/css/main.css'
      ])
    })
  )
})

// フェッチ時
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // APIリクエストの場合
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(cache => {
        return cache.match(request).then(response => {
          const fetchPromise = fetch(request).then(networkResponse => {
            // 成功レスポンスのみキャッシュ
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          })
          return response || fetchPromise
        })
      })
    )
  }
})
```

### 遅延読み込み (Lazy Loading)

```typescript
// コンポーネントの遅延読み込み
const Calendar = lazy(() => import('./components/Calendar'))
const WorkEntryForm = lazy(() => import('./components/WorkEntryForm'))
const WorkList = lazy(() => import('./components/WorkList'))

// メインコンポーネント
const AchievementRecordContainer = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="grid grid-cols-3 gap-6">
        <Suspense fallback={<div>Loading calendar...</div>}>
          <Calendar />
        </Suspense>

        <Suspense fallback={<div>Loading work list...</div>}>
          <WorkList />
        </Suspense>

        <Suspense fallback={<div>Loading form...</div>}>
          <WorkEntryForm />
        </Suspense>
      </div>
    </Suspense>
  )
}
```

## UI最適化

### 仮想スクロール (大量データ時)

```typescript
// react-windowを使用した仮想化
import { FixedSizeList as List } from 'react-window'

const WorkListVirtualized = ({ entries }: { entries: WorkEntry[] }) => {
  const itemHeight = 60 // 各アイテムの高さ

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const entry = entries[index]
    return (
      <div style={style} className="work-item">
        <WorkItem entry={entry} />
      </div>
    )
  }

  return (
    <List
      height={400}
      itemCount={entries.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

### メモ化 (React.memo, useMemo, useCallback)

```typescript
// コンポーネントのメモ化
const WorkItem = React.memo(({ entry, onEdit, onDelete }: WorkItemProps) => {
  console.log('WorkItem rendered:', entry.id)

  return (
    <div className="work-item">
      <h3>{entry.title}</h3>
      <p>{entry.hours}時間</p>
      <button onClick={() => onEdit(entry)}>編集</button>
      <button onClick={() => onDelete(entry.id)}>削除</button>
    </div>
  )
})

// 関数のメモ化
const WorkList = ({ entries, categories }: WorkListProps) => {
  const categoryMap = useMemo(() => {
    return categories.reduce((map, category) => {
      map[category.id] = category
      return map
    }, {} as Record<string, WorkCategory>)
  }, [categories])

  const handleEdit = useCallback((entry: WorkEntry) => {
    // 編集処理
  }, [])

  const handleDelete = useCallback(async (entryId: string) => {
    // 削除処理
  }, [])

  return (
    <div>
      {entries.map(entry => (
        <WorkItem
          key={entry.id}
          entry={entry}
          category={categoryMap[entry.categoryId]}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}
```

### コード分割

```typescript
// ルートベースのコード分割
const AchievementRecord = lazy(() =>
  import('./pages/AchievementRecord')
)

const CalendarPage = lazy(() =>
  import('./pages/CalendarPage')
)

const routes = [
  {
    path: '/achievement-record',
    element: (
      <Suspense fallback={<PageLoader />}>
        <AchievementRecord />
      </Suspense>
    )
  },
  {
    path: '/calendar',
    element: (
      <Suspense fallback={<PageLoader />}>
        <CalendarPage />
      </Suspense>
    )
  }
]
```

## バンドル最適化

### 動的インポート

```typescript
// 大きなライブラリの遅延読み込み
const HeavyComponent = () => {
  const [ChartComponent, setChartComponent] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    import('./components/Chart').then(module => {
      setChartComponent(() => module.default)
    })
  }, [])

  if (!ChartComponent) return <div>Loading chart...</div>

  return <ChartComponent />
}
```

### Tree Shaking

```typescript
// 必要なモジュールのみインポート
import { useState, useEffect } from 'react'  // ✓ 良い
// import React from 'react'                  // ✗ 避ける

// lodashの個別インポート
import isEqual from 'lodash/isEqual'         // ✓ 良い
// import { isEqual } from 'lodash'           // ✗ Tree Shakingされない

// UIライブラリの個別インポート
import { Button, Input } from '@shadcn/ui'   // ✓ 良い
// import * as UI from '@shadcn/ui'           // ✗ 全てインポート
```

### 画像最適化

```typescript
// Next.js Imageコンポーネント
import Image from 'next/image'

const OptimizedImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={200}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    />
  )
}

// WebP対応
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="Fallback" loading="lazy" />
</picture>
```

## API最適化

### GraphQLを使用した効率的なデータ取得

```typescript
// GraphQLクエリ
const GET_WORK_ENTRIES = gql`
  query GetWorkEntries($filters: WorkFiltersInput!) {
    workEntries(filters: $filters) {
      id
      title
      hours
      date
      category {
        id
        name
        color
      }
    }
  }
`

// フック使用
const { data, loading } = useQuery(GET_WORK_ENTRIES, {
  variables: { filters },
  fetchPolicy: 'cache-first'
})
```

### HTTP/2 Server Push

```javascript
// サーバー側でのリソースプッシュ
app.get('/achievement-record', (req, res) => {
  // 重要なリソースを事前にプッシュ
  res.push('/api/work-categories', {
    request: { accept: 'application/json' },
    response: { 'content-type': 'application/json' }
  })

  res.push('/static/js/calendar.js', {
    request: { accept: '*/javascript' },
    response: { 'content-type': 'application/javascript' }
  })

  res.render('achievement-record')
})
```

## データベース最適化

### インデックス最適化

```sql
-- 業務エントリのインデックス
CREATE INDEX idx_work_entries_date ON work_entries(date);
CREATE INDEX idx_work_entries_user_date ON work_entries(user_id, date);
CREATE INDEX idx_work_entries_category ON work_entries(category_id);

-- 複合インデックス
CREATE INDEX idx_work_entries_user_date_category
ON work_entries(user_id, date, category_id);
```

### クエリ最適化

```typescript
// N+1問題を避けるためのJOIN
const getWorkEntriesWithCategories = async (userId: string, startDate: Date, endDate: Date) => {
  return await db
    .select({
      id: workEntries.id,
      title: workEntries.title,
      hours: workEntries.hours,
      date: workEntries.date,
      categoryName: workCategories.name,
      categoryColor: workCategories.color
    })
    .from(workEntries)
    .innerJoin(workCategories, eq(workEntries.categoryId, workCategories.id))
    .where(and(
      eq(workEntries.userId, userId),
      gte(workEntries.date, startDate),
      lte(workEntries.date, endDate)
    ))
}
```

## 監視と測定

### パフォーマンス監視

```typescript
// Web Vitals測定
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

const reportWebVitals = (metric: any) => {
  // 監視サービスに送信
  console.log(metric)

  // 例: Google Analyticsに送信
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true
  })
}

getCLS(reportWebVitals)
getFID(reportWebVitals)
getFCP(reportWebVitals)
getLCP(reportWebVitals)
getTTFB(reportWebVitals)
```

### パフォーマンス予算設定

```javascript
// webpack-bundle-analyzerやLighthouse CI
const performanceBudget = {
  resources: [
    {
      resourceType: 'script',
      budget: 500 * 1024 // 500KB
    },
    {
      resourceType: 'stylesheet',
      budget: 100 * 1024 // 100KB
    }
  ],
  timings: [
    {
      metric: 'firstContentfulPaint',
      budget: 1500 // 1.5秒
    },
    {
      metric: 'largestContentfulPaint',
      budget: 2500 // 2.5秒
    }
  ]
}
```

## CDNとエッジ最適化

### 静的リソースのCDN配信

```javascript
// CDN設定
const CDN_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://cdn.example.com'
  : ''

// 画像URL生成
const getOptimizedImageUrl = (imageId: string, width: number, height: number) => {
  return `${CDN_BASE_URL}/images/${imageId}?w=${width}&h=${height}&auto=format,compress`
}
```

### エッジキャッシュ戦略

```nginx
# Nginx設定例
location /api/work-entries {
  # GETリクエストのみキャッシュ
  proxy_cache work_entries_cache;
  proxy_cache_valid 200 5m;
  proxy_cache_use_stale error timeout updating;

  # POST/PUT/DELETEはキャッシュ無効化
  if ($request_method !~ ^(GET)$) {
    set $no_cache 1;
  }

  proxy_pass http://api_backend;
}
```

## 継続的な最適化

### パフォーマンス監査の自動化

```yaml
# CI/CDでのパフォーマンスチェック
- name: Performance audit
  run: |
    npm run build
    npx lighthouse-ci \
      --url https://staging.example.com/achievement-record \
      --config-path lighthouse-config.js \
      --budget-path performance-budget.json
```

### A/Bテストによる最適化検証

```typescript
// 機能フラグを使用したA/Bテスト
const useOptimizedList = () => {
  const featureFlags = useFeatureFlags()

  if (featureFlags.enableVirtualScroll) {
    return <WorkListVirtualized entries={entries} />
  }

  return <WorkListStandard entries={entries} />
}
```

このパフォーマンス最適化戦略により、高速でスケーラブルな実績日報入力システムを実現します。
