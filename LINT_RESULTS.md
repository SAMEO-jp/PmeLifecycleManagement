# ESLint リント結果レポート

**実行日時**: 2025年10月31日  
**総問題数**: 83件 (35 エラー, 48 警告)  
**自動修正可能**: 1件  

## 概要

プロジェクト全体でESLintを実行した結果、以下の問題が検出されました。

- **エラー**: 35件
- **警告**: 48件
- **自動修正可能**: 1件

## エラーの詳細

### Database Schema (2件)

#### `/db/schema/equipmentMaster.ts`
- **6:46** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any)
  ```typescript
  parentId: text("parent_id").references((): any => equipmentMaster.id, { onDelete: "set null" }),
  ```

#### `/db/schema/purchaseItemMaster.ts`
- **6:46** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any)
  ```typescript
  parentId: text("parent_id").references((): any => purchaseItemMaster.id, { onDelete: "set null" }),
  ```

### Jest設定 (1件)

#### `/jest.config.js`
- **1:18** - エラー: `A require() style import is forbidden` (@typescript-eslint/no-require-imports)

### Middleware (0件 - 未使用変数警告のみ)

### テストファイル (4件)

#### `/src/__tests__/server/projects/repositories/projectsRepository.test.ts`
- **79:13** - 警告: `'inactiveProject' は値が代入されていますが使用されていません` (@typescript-eslint/no-unused-vars)

#### `/src/__tests__/server/projects/services/projectsService.test.ts`
- **109:41** - エラー: `A require() style import is forbidden` (@typescript-eslint/no-require-imports)
- **127:41** - エラー: `A require() style import is forbidden` (@typescript-eslint/no-require-imports)
- **147:41** - エラー: `A require() style import is forbidden` (@typescript-eslint/no-require-imports)
- **165:41** - エラー: `A require() style import is forbidden` (@typescript-eslint/no-require-imports)

### Authページ (1件)

#### `/src/app/auth/[authView]/page.tsx`
- **36:35** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any)
  ```typescript
  view={view as any}
  ```

### UIコンポーネント (多数)

#### `/src/components/app/components/AppLayout.tsx`
- **17:9** - 警告: `'headerHeight' は値が代入されていますが使用されていません` (@typescript-eslint/no-unused-vars)

#### `/src/components/app/components/AppSidebar.tsx`
- **8:10** - 警告: `'MenuProvider' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **10:27** - エラー: `Component definition is missing display name` (react/display-name)

#### `/src/components/app/components/DevagLayout/DevagLayout.tsx`
- **4:15** - 警告: `'X' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **8:10** - 警告: `'Separator' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **205:59** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any)
- **310:48-74** - エラー: `'` can be escaped with `&apos;` などのエンティティ (react/no-unescaped-entities) - 5件

#### `/src/components/app/components/Sidebar/SidebarFooter.tsx`
- **6:30** - エラー: `Component definition is missing display name` (react/display-name)

#### `/src/components/app/components/Sidebar/contexts/MenuContext.tsx`
- **9:9** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any)

#### `/src/components/app/components/Sidebar/featuer/achievement-recode/AchievementRecordSidebarSection.tsx`
- **8:3** - 警告: `'SidebarGroupLabel' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **14:10** - 警告: `'LeftSectionTestControls' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)

### プロバイダー (多数)

#### `/src/components/app/providers/display-size-context.tsx`
- **40:39,49** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any) - 2件
- **100:5** - エラー: `setState synchronously within an effect` (react-hooks/set-state-in-effect)

#### `/src/components/app/providers/font-provider.tsx`
- **39-43:16** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any) - 5件

#### `/src/components/ui/sidebar.tsx`
- **611:26** - エラー: `レンダー中に不純な関数を呼び出すことはできません` (react-hooks/purity)

### Better Auth (2件)

#### `/src/core/better-auth/auth-errors-docs.ts`
- **7:10** - 警告: `'authClient' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)

#### `/src/core/better-auth/auth-errors.ts`
- **5:10** - 警告: `'authClient' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)

### Achievement Record機能 (多数)

#### `/src/featuer/achievement-record/component/time-grid/DraggableEvent.tsx`
- **2:10** - 警告: `'Badge' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **5:10** - 警告: `'MoreHorizontal' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **23:3** - 警告: `'dayIndex' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **26:3** - 警告: `'onResize' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **29:3** - 警告: `'onChangeUrgency' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **30:3** - 警告: `'onChangeProgress' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **31:3** - 警告: `'onChangeProject' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)

#### `/src/featuer/achievement-record/component/time-grid/ScrollSection.tsx`
- **136:5** - エラー: `This value cannot be modified` (react-hooks/immutability)

#### `/src/featuer/achievement-record/component/time-grid/TimeGridTable.tsx`
- **1:10** - 警告: `'Badge' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **2:10** - 警告: `'Button' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **4:10,16,23** - 警告: 未使用のインポート (`Hash`, `Clock`, `FileText`) (@typescript-eslint/no-unused-vars) - 3件
- **5:75** - 警告: `'calculateEventHeight' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **55:7** - 警告: `'users' は値が代入されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **78:7** - 警告: `'getUrgencyColor' は値が代入されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **180:143** - 警告: `'viewMode' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)

#### `/src/featuer/achievement-record/containers/Left/management/EquipmentManagementComponent.tsx`
- **7:16,29,41** - 警告: 未使用のインポート (`CardContent`, `CardHeader`, `CardTitle`) (@typescript-eslint/no-unused-vars) - 3件
- **51:53** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any)

#### `/src/featuer/achievement-record/containers/Left/management/TaskCreationComponent.tsx`
- **7:29,41** - 警告: 未使用のインポート (`CardHeader`, `CardTitle`) (@typescript-eslint/no-unused-vars) - 2件
- **9:10** - 警告: `'Badge' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **140:94** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any)

#### `/src/featuer/achievement-record/containers/Left/management/TaskTypesManagementComponent.tsx`
- **7:16,29,41** - 警告: 未使用のインポート (`CardContent`, `CardHeader`, `CardTitle`) (@typescript-eslint/no-unused-vars) - 3件
- **10:10,18,33,45,60** - 警告: 未使用のインポート (Select関連) (@typescript-eslint/no-unused-vars) - 5件
- **54:52** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any)

#### `/src/featuer/achievement-record/containers/Left/project/LeftProjectListComponent.tsx`
- **5:16,29,41** - 警告: 未使用のインポート (`CardContent`, `CardHeader`, `CardTitle`) (@typescript-eslint/no-unused-vars) - 3件
- **42:15** - 警告: `'currentUserId' は値が代入されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **61:54** - 警告: `'taskError' は値が代入されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **80:51** - 警告: `'userError' は値が代入されていますが使用されていません` (@typescript-eslint/no-unused-vars)

#### `/src/featuer/achievement-record/containers/Left/project/LeftProjectMakeComponent.tsx`
- **79:10** - 警告: `'Plus' は定義されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **101:10** - 警告: `'isCreating' は値が代入されていますが使用されていません` (@typescript-eslint/no-unused-vars)
- **129:15** - エラー: `'formattedProjects' is never reassigned. Use 'const' instead` (prefer-const)
- **129:51** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any)

### ユーティリティ (2件)

#### `/src/lib/repository-utils.ts`
- **82:67,95** - エラー: `Unexpected any. Specify a different type` (@typescript-eslint/no-explicit-any) - 2件

## 主な問題点の分類

### 1. TypeScriptの型安全性 (15件)
- `any` 型の使用が多数 (15件)
- 主にデータベース参照、コンポーネントprops、関数パラメータで発生

### 2. 未使用変数/インポート (30件)
- インポートされたが使用されていないコンポーネントが多い
- 特にUIコンポーネント (Card, Button, Badgeなど)
- ローカル変数も多数未使用

### 3. React Hooks関連 (3件)
- 副作用内の同期setState
- 不純な関数のレンダー内呼び出し
- props/引数の変更不可違反

### 4. Reactコンポーネント (2件)
- display name の欠如
- エンティティのエスケープ漏れ

### 5. その他 (3件)
- require() スタイルのインポート
- const/let の誤用

## 推奨される修正優先度

1. **高優先度**: React Hooks関連の問題 (パフォーマンス/動作に影響)
2. **中優先度**: TypeScriptの型安全性 (any型の排除)
3. **低優先度**: 未使用変数/インポート (コード整理)

## 自動修正可能な問題

- `prefer-const` ルール違反: 1件 (`formattedProjects` を const に変更)

