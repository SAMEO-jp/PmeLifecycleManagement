# タスク関連フロントエンド実装計画

## 作りたいこと
task_types、equipment_master、users、tasks、task_project_relations、task_user_relations、task_equipment_relationsの7テーブルに対するフロントエンド層（Hook/Context/Provider）を実装。既存のprojectsパターンに準拠。

## 実装手順
1. **Context層**: React ContextとProviderの作成
2. **Hook層**: カスタムフックの作成（CRUD操作用）
3. **統合**: ContextとHookの連携

## フォルダ構造

既存の`projects`パターンに準拠し、各テーブルごとに独立したフォルダを作成：

```
src/server/
├── task-types/              # task_types用
│   ├── types/
│   ├── repositories/
│   ├── services/
│   ├── context/             # NEW
│   │   ├── index.ts
│   │   └── taskTypes-context.tsx
│   │   └── taskTypes-provider.tsx
│   └── hook/                # NEW
│       ├── index.ts
│       └── useCreateTaskType.ts
│       └── useDeleteTaskType.ts
│       └── useTaskType.ts
│       └── useTaskTypes.ts
│       └── useUpdateTaskType.ts
├── equipment-master/        # equipment_master用
│   ├── types/
│   ├── repositories/
│   ├── services/
│   ├── context/             # NEW
│   │   ├── index.ts
│   │   └── equipmentMaster-context.tsx
│   │   └── equipmentMaster-provider.tsx
│   └── hook/                # NEW
│       ├── index.ts
│       └── useCreateEquipmentMaster.ts
│       └── useDeleteEquipmentMaster.ts
│       └── useEquipmentMaster.ts
│       └── useEquipmentMasters.ts
│       └── useUpdateEquipmentMaster.ts
├── users/                   # users用
│   ├── types/
│   ├── repositories/
│   ├── services/
│   ├── context/             # NEW
│   │   ├── index.ts
│   │   └── users-context.tsx
│   │   └── users-provider.tsx
│   └── hook/                # NEW
│       ├── index.ts
│       └── useCreateUser.ts
│       └── useDeleteUser.ts
│       └── useUser.ts
│       └── useUsers.ts
│       └── useUpdateUser.ts
├── tasks/                   # tasks用
│   ├── types/
│   ├── repositories/
│   ├── services/
│   ├── context/             # NEW
│   │   ├── index.ts
│   │   └── tasks-context.tsx
│   │   └── tasks-provider.tsx
│   └── hook/                # NEW
│       ├── index.ts
│       └── useCreateTask.ts
│       └── useDeleteTask.ts
│       └── useTask.ts
│       └── useTasks.ts
│       └── useUpdateTask.ts
├── task-project-relations/  # task_project_relations用
│   ├── types/
│   ├── repositories/
│   ├── services/
│   ├── context/             # NEW
│   │   ├── index.ts
│   │   └── taskProjectRelations-context.tsx
│   │   └── taskProjectRelations-provider.tsx
│   └── hook/                # NEW
│       ├── index.ts
│       └── useCreateTaskProjectRelation.ts
│       └── useDeleteTaskProjectRelation.ts
│       └── useTaskProjectRelation.ts
│       └── useTaskProjectRelations.ts
│       └── useUpdateTaskProjectRelation.ts
│       └── useSyncTaskProjectRelations.ts
├── task-user-relations/     # task_user_relations用
│   ├── types/
│   ├── repositories/
│   ├── services/
│   ├── context/             # NEW
│   │   ├── index.ts
│   │   └── taskUserRelations-context.tsx
│   │   └── taskUserRelations-provider.tsx
│   └── hook/                # NEW
│       ├── index.ts
│       └── useCreateTaskUserRelation.ts
│       └── useDeleteTaskUserRelation.ts
│       └── useTaskUserRelation.ts
│       └── useTaskUserRelations.ts
│       └── useUpdateTaskUserRelation.ts
│       └── useSyncTaskUserRelations.ts
└── task-equipment-relations/ # task_equipment_relations用
    ├── types/
    ├── repositories/
    ├── services/
    ├── context/             # NEW
    │   ├── index.ts
    │   └── taskEquipmentRelations-context.tsx
    │   └── taskEquipmentRelations-provider.tsx
    └── hook/                # NEW
        ├── index.ts
        └── useCreateTaskEquipmentRelation.ts
        └── useDeleteTaskEquipmentRelation.ts
        └── useTaskEquipmentRelation.ts
        └── useTaskEquipmentRelations.ts
        └── useUpdateTaskEquipmentRelation.ts
        └── useSyncTaskEquipmentRelations.ts
```

## 実装順序
- マスターデータ: task_types → equipment_master → users
- メインエンティティ: tasks
- リレーション: task_project_relations → task_user_relations → task_equipment_relations

## タスクリスト

### 1. task_types
- [x] `src/server/task-types/context/` フォルダ作成
- [x] `context/taskTypes-context.tsx` 作成（React Context定義）
- [x] `context/taskTypes-provider.tsx` 作成（Providerコンポーネント）
- [x] `context/index.ts` 作成（エクスポート）
- [x] `src/server/task-types/hook/` フォルダ作成
- [x] `hook/useTaskTypes.ts` 作成（一覧取得・状態管理）
- [x] `hook/useTaskType.ts` 作成（単一取得・状態管理）
- [x] `hook/useCreateTaskType.ts` 作成（作成処理）
- [x] `hook/useUpdateTaskType.ts` 作成（更新処理）
- [x] `hook/useDeleteTaskType.ts` 作成（削除処理）
- [x] `hook/index.ts` 作成（エクスポート）

### 2. equipment_master
- [x] `src/server/equipment-master/context/` フォルダ作成
- [x] `context/equipmentMaster-context.tsx` 作成（React Context定義）
- [x] `context/equipmentMaster-provider.tsx` 作成（Providerコンポーネント）
- [x] `context/index.ts` 作成（エクスポート）
- [x] `src/server/equipment-master/hook/` フォルダ作成
- [x] `hook/useEquipmentMasters.ts` 作成（一覧取得・状態管理）
- [x] `hook/useEquipmentMaster.ts` 作成（単一取得・状態管理）
- [x] `hook/useCreateEquipmentMaster.ts` 作成（作成処理）
- [x] `hook/useUpdateEquipmentMaster.ts` 作成（更新処理）
- [x] `hook/useDeleteEquipmentMaster.ts` 作成（削除処理）
- [x] `hook/index.ts` 作成（エクスポート）

### 3. users
- [x] `src/server/users/context/` フォルダ作成
- [x] `context/users-context.tsx` 作成（React Context定義）
- [x] `context/users-provider.tsx` 作成（Providerコンポーネント）
- [x] `context/index.ts` 作成（エクスポート）
- [x] `src/server/users/hook/` フォルダ作成
- [x] `hook/useUsers.ts` 作成（一覧取得・状態管理）
- [x] `hook/useUser.ts` 作成（単一取得・状態管理）
- [x] `hook/useCreateUser.ts` 作成（作成処理）
- [x] `hook/useUpdateUser.ts` 作成（更新処理）
- [x] `hook/useDeleteUser.ts` 作成（削除処理）
- [x] `hook/index.ts` 作成（エクスポート）

### 4. tasks
- [x] `src/server/tasks/context/` フォルダ作成
- [x] `context/tasks-context.tsx` 作成（React Context定義）
- [x] `context/tasks-provider.tsx` 作成（Providerコンポーネント）
- [x] `context/index.ts` 作成（エクスポート）
- [x] `src/server/tasks/hook/` フォルダ作成
- [x] `hook/useTasks.ts` 作成（一覧取得・状態管理）
- [x] `hook/useTask.ts` 作成（単一取得・状態管理）
- [x] `hook/useCreateTask.ts` 作成（作成処理）
- [x] `hook/useUpdateTask.ts` 作成（更新処理）
- [x] `hook/useDeleteTask.ts` 作成（削除処理）
- [x] `hook/index.ts` 作成（エクスポート）

### 5. task_project_relations
- [x] `src/server/task-project-relations/context/` フォルダ作成
- [x] `context/taskProjectRelations-context.tsx` 作成（React Context定義）
- [x] `context/taskProjectRelations-provider.tsx` 作成（Providerコンポーネント）
- [x] `context/index.ts` 作成（エクスポート）
- [x] `src/server/task-project-relations/hook/` フォルダ作成
- [x] `hook/useTaskProjectRelations.ts` 作成（一覧取得・状態管理）
- [x] `hook/useTaskProjectRelation.ts` 作成（単一取得・状態管理）
- [x] `hook/useCreateTaskProjectRelation.ts` 作成（作成処理）
- [x] `hook/useUpdateTaskProjectRelation.ts` 作成（更新処理）
- [x] `hook/useDeleteTaskProjectRelation.ts` 作成（削除処理）
- [x] `hook/useSyncTaskProjectRelations.ts` 作成（同期処理）
- [x] `hook/index.ts` 作成（エクスポート）

### 6. task_user_relations
- [x] `src/server/task-user-relations/context/` フォルダ作成
- [x] `context/taskUserRelations-context.tsx` 作成（React Context定義）
- [x] `context/taskUserRelations-provider.tsx` 作成（Providerコンポーネント）
- [x] `context/index.ts` 作成（エクスポート）
- [x] `src/server/task-user-relations/hook/` フォルダ作成
- [x] `hook/useTaskUserRelations.ts` 作成（一覧取得・状態管理）
- [x] `hook/useTaskUserRelation.ts` 作成（単一取得・状態管理）
- [x] `hook/useCreateTaskUserRelation.ts` 作成（作成処理）
- [x] `hook/useUpdateTaskUserRelation.ts` 作成（更新処理）
- [x] `hook/useDeleteTaskUserRelation.ts` 作成（削除処理）
- [x] `hook/useSyncTaskUserRelations.ts` 作成（同期処理）
- [x] `hook/index.ts` 作成（エクスポート）

### 7. task_equipment_relations
- [x] `src/server/task-equipment-relations/context/` フォルダ作成
- [x] `context/taskEquipmentRelations-context.tsx` 作成（React Context定義）
- [x] `context/taskEquipmentRelations-provider.tsx` 作成（Providerコンポーネント）
- [x] `context/index.ts` 作成（エクスポート）
- [x] `src/server/task-equipment-relations/hook/` フォルダ作成
- [x] `hook/useTaskEquipmentRelations.ts` 作成（一覧取得・状態管理）
- [x] `hook/useTaskEquipmentRelation.ts` 作成（単一取得・状態管理）
- [x] `hook/useCreateTaskEquipmentRelation.ts` 作成（作成処理）
- [x] `hook/useUpdateTaskEquipmentRelation.ts` 作成（更新処理）
- [x] `hook/useDeleteTaskEquipmentRelation.ts` 作成（削除処理）
- [x] `hook/useSyncTaskEquipmentRelations.ts` 作成（同期処理）
- [x] `hook/index.ts` 作成（エクスポート）
