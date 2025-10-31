# サーバーサイドコードのテストガイド

このディレクトリには、サーバーサイドコードのテストファイルが含まれています。

## テストの実行方法

### 基本的なテスト実行
```bash
# 全テスト実行
pnpm test

# テストを監視モードで実行（ファイル変更時に自動実行）
pnpm test:watch

# カバレッジレポート付きで実行
pnpm test:coverage
```

## テスト構造

```
src/__tests__/
├── utils/                    # テストユーティリティ
│   └── test-utils.ts        # 共通のテストヘルパー関数
├── server/                   # サーバーサイドコードのテスト
│   ├── projects/            # プロジェクト機能のテスト
│   │   ├── repositories/    # Repository層のテスト
│   │   │   └── projectsRepository.test.ts
│   │   ├── services/        # Service層のテスト
│   │   │   └── projectsService.test.ts
│   │   └── hook/            # React Hook層のテスト
│   │       └── useProject.test.tsx
│   └── ...                  # 他の機能モジュール
└── README.md                # このファイル
```

## テストの種類

### 1. Repository層のテスト
- **対象**: データベースアクセス層
- **テスト内容**:
  - CRUD操作の検証
  - クエリビルダーの動作確認
  - エラーハンドリング
- **使用技術**: Jestモック

### 2. Service層のテスト
- **対象**: ビジネスロジック層
- **テスト内容**:
  - バリデーション処理
  - ビジネスルールの適用
  - Repository層との連携
- **使用技術**: Jestモック

### 3. React Hook層のテスト
- **対象**: カスタムReact Hook
- **テスト内容**:
  - 非同期データ取得
  - 状態管理
  - エラーハンドリング
  - 再取得機能
- **使用技術**: React Testing Library

## テスト作成のベストプラクティス

### 1. テストファイルの命名規則
- テスト対象ファイル名 + `.test.ts` または `.test.tsx`
- 例: `useProject.ts` → `useProject.test.tsx`

### 2. テスト構造
```typescript
describe('対象のコンポーネント/関数', () => {
  describe('特定の機能', () => {
    it('期待される動作', () => {
      // Arrange: テストの準備
      // Act: テスト対象の実行
      // Assert: 結果の検証
    })
  })
})
```

### 3. モック化
- **外部依存関係は必ずモック化**する
- データベース操作、API呼び出し、外部ライブラリなど
- モックは各テストの `beforeEach` で初期化

### 4. テストデータの作成
- `test-utils.ts` のヘルパー関数を使用
- 現実的なテストデータを作成
- テストケースごとにデータを分離

## テスト実行例

### Repository層テストの実行
```bash
# 特定のRepositoryテストのみ実行
pnpm test projectsRepository.test.ts

# projects関連の全テスト実行
pnpm test projects
```

### テストカバレッジの確認
```bash
pnpm test:coverage
```
実行後、`coverage/` ディレクトリにHTMLレポートが生成されます。

## テストデータの管理

### モックデータ生成関数
```typescript
// src/__tests__/utils/test-utils.ts
export const createMockProject = (overrides = {}) => ({
  id: 'test-project-id',
  name: 'Test Project',
  projectNumber: 'PME001',
  status: 'active',
  created_at: new Date('2024-01-01'),
  updated_at: new Date('2024-01-01'),
  deleted_at: null,
  ...overrides,
})
```

### 使用例
```typescript
const mockProject = createMockProject({ name: 'Custom Project' })
```

## 注意事項

1. **モックは適切にリセット**する
   - `jest.clearAllMocks()` を `beforeEach` で実行

2. **非同期処理のテスト**では `waitFor` を使用
   ```typescript
   await waitFor(() => {
     expect(result.current.isLoading).toBe(false)
   })
   ```

3. **React Hookのテスト**では `renderHook` を使用
   ```typescript
   const { result } = renderHook(() => useProject(params))
   ```

4. **エラーハンドリング**も忘れずにテストする

## 既存のテストパターン

### Repository層テスト
- CRUD操作の基本機能テスト
- パラメータによるフィルタリングテスト
- エラーケースのテスト

### Service層テスト
- 正常系/異常系のレスポンステスト
- バリデーションエラーのテスト
- Repository連携のテスト

### Hook層テスト
- データ取得のテスト
- ローディング状態のテスト
- エラーハンドリングのテスト
- refetch機能のテスト

## 拡張予定

- **統合テスト**: 複数の層が連携するテスト
- **E2Eテスト**: Next.js API Routesのテスト
- **パフォーマンステスト**: 負荷テスト

## トラブルシューティング

### モジュール解決エラー
- `jest.config.js` の `moduleNameMapper` を確認
- パスエイリアス (`@/`) が正しく設定されているか確認

### React Testing Libraryエラー
- `jest.setup.js` に `@testing-library/jest-dom` がインポートされているか確認
- `testEnvironment: 'jsdom'` が設定されているか確認

### カバレッジが低い場合
- テストケースを追加
- エッジケースを考慮
- エラーハンドリングを追加
