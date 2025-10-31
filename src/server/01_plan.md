# タスク関連バックエンド実装計画

## 作りたいこと
task_types、equipment_master、users、tasks、task_project_relations、task_user_relations、task_equipment_relationsの7テーブルに対するバックエンド層（Repository/Service/Types）を実装。既存のprojectsパターンに準拠。

## 実装手順
1. **Types定義**: 各テーブル用の型定義ファイル作成（project.types.tsを参考）
2. **Repository層**: データベースアクセス実装（CRUD操作、論理削除対応）
3. **Validator**: バリデーション関数作成
4. **Service層**: ビジネスロジック・エラーハンドリング実装
5. **index.ts**: 各層のエクスポート設定

## フォルダ構造

既存の`projects`パターンに準拠し、各テーブルごとに独立したフォルダを作成：

```
src/server/
├── task-types/              # task_types用
│   ├── types/
│   │   ├── index.ts
│   │   └── taskTypes.types.ts
│   ├── repositories/
│   │   ├── index.ts
│   │   └── taskTypesRepository.ts
│   └── services/
│       ├── index.ts
│       ├── taskTypes.validator.ts
│       └── taskTypesService.ts
├── equipment-master/        # equipment_master用
│   ├── types/
│   │   ├── index.ts
│   │   └── equipmentMaster.types.ts
│   ├── repositories/
│   │   ├── index.ts
│   │   └── equipmentMasterRepository.ts
│   └── services/
│       ├── index.ts
│       ├── equipmentMaster.validator.ts
│       └── equipmentMasterService.ts
├── users/                   # users用（task_user_relationsで参照）
│   ├── types/
│   │   ├── index.ts
│   │   └── users.types.ts
│   ├── repositories/
│   │   ├── index.ts
│   │   └── usersRepository.ts
│   └── services/
│       ├── index.ts
│       ├── users.validator.ts
│       └── usersService.ts
├── tasks/                   # tasks用
│   ├── types/
│   │   ├── index.ts
│   │   └── tasks.types.ts
│   ├── repositories/
│   │   ├── index.ts
│   │   └── tasksRepository.ts
│   └── services/
│       ├── index.ts
│       ├── tasks.validator.ts
│       └── tasksService.ts
├── task-project-relations/ # task_project_relations用
│   ├── types/
│   │   ├── index.ts
│   │   └── taskProjectRelations.types.ts
│   ├── repositories/
│   │   ├── index.ts
│   │   └── taskProjectRelationsRepository.ts
│   └── services/
│       ├── index.ts
│       ├── taskProjectRelations.validator.ts
│       └── taskProjectRelationsService.ts
├── task-user-relations/     # task_user_relations用
│   ├── types/
│   │   ├── index.ts
│   │   └── taskUserRelations.types.ts
│   ├── repositories/
│   │   ├── index.ts
│   │   └── taskUserRelationsRepository.ts
│   └── services/
│       ├── index.ts
│       ├── taskUserRelations.validator.ts
│       └── taskUserRelationsService.ts
└── task-equipment-relations/ # task_equipment_relations用
    ├── types/
    │   ├── index.ts
    │   └── taskEquipmentRelations.types.ts
    ├── repositories/
    │   ├── index.ts
    │   └── taskEquipmentRelationsRepository.ts
    └── services/
        ├── index.ts
        ├── taskEquipmentRelations.validator.ts
        └── taskEquipmentRelationsService.ts
```

## 実装順序
- マスターデータ: task_types → equipment_master → users
- メインエンティティ: tasks
- リレーション: task_project_relations → task_user_relations → task_equipment_relations

## タスクリスト

### Task 1. task_types
- [x] `src/server/task-types/` フォルダ作成
- [x] `types/taskTypes.types.ts` 作成（Table型、Request型、Params型、Response型）
- [x] `types/index.ts` 作成（エクスポート）
- [x] `repositories/taskTypesRepository.ts` 作成（findAll, findById, create, update, softDelete）
- [x] `repositories/index.ts` 作成（エクスポート）
- [x] `services/taskTypes.validator.ts` 作成（validateCreate, validateUpdate）
- [x] `services/taskTypesService.ts` 作成（getAll, getById, create, update, softDelete）
- [x] `services/index.ts` 作成（エクスポート）

### Task 2. equipment_master
- [x] `src/server/equipment-master/` フォルダ作成
- [x] `types/equipmentMaster.types.ts` 作成（階層構造対応、parentId含む）
- [x] `types/index.ts` 作成（エクスポート）
- [x] `repositories/equipmentMasterRepository.ts` 作成（findAll, findById, create, update, softDelete, findChildren）
- [x] `repositories/index.ts` 作成（エクスポート）
- [x] `services/equipmentMaster.validator.ts` 作成（validateCreate, validateUpdate, 循環参照チェック）
- [x] `services/equipmentMasterService.ts` 作成（getAll, getById, create, update, softDelete, getChildren）
- [x] `services/index.ts` 作成（エクスポート）

### Task 3. users
- [x] `src/server/users/` フォルダ作成
- [x] `types/users.types.ts` 作成（Table型、Request型、Params型、Response型、email, name含む）
- [x] `types/index.ts` 作成（エクスポート）
- [x] `repositories/usersRepository.ts` 作成（findAll, findById, findByEmail, create, update）
- [x] `repositories/index.ts` 作成（エクスポート）
- [x] `services/users.validator.ts` 作成（validateCreate, validateUpdate, email形式検証、重複チェック）
- [x] `services/usersService.ts` 作成（getAll, getById, getByEmail, create, update）
- [x] `services/index.ts` 作成（エクスポート）

### Task 4. tasks
- [x] `src/server/tasks/` フォルダ作成
- [x] `types/tasks.types.ts` 作成（taskTypeId, planId含む）
- [x] `types/index.ts` 作成（エクスポート）
- [x] `repositories/tasksRepository.ts` 作成（findAll, findById, create, update, softDelete, findByTaskTypeId）
- [x] `repositories/index.ts` 作成（エクスポート）
- [x] `services/tasks.validator.ts` 作成（validateCreate, validateUpdate, taskTypeId存在チェック）
- [x] `services/tasksService.ts` 作成（getAll, getById, create, update, softDelete, getByTaskType）
- [x] `services/index.ts` 作成（エクスポート）

### Task 5. task_project_relations
- [x] `src/server/task-project-relations/` フォルダ作成
- [x] `types/taskProjectRelations.types.ts` 作成（複合主キー、relationType, sortOrder含む）
- [x] `types/index.ts` 作成（エクスポート）
- [x] `repositories/taskProjectRelationsRepository.ts` 作成（findByTaskId, findByProjectId, create, update, softDelete, bulkCreate）
- [x] `repositories/index.ts` 作成（エクスポート）
- [x] `services/taskProjectRelations.validator.ts` 作成（validateCreate, validateUpdate, 重複チェック）
- [x] `services/taskProjectRelationsService.ts` 作成（getByTask, getByProject, create, update, softDelete, syncRelations）
- [x] `services/index.ts` 作成（エクスポート）

### Task 6. task_user_relations
- [x] `src/server/task-user-relations/` フォルダ作成
- [x] `types/taskUserRelations.types.ts` 作成（複合主キー、roleType, estimatedHours, actualHours含む）
- [x] `types/index.ts` 作成（エクスポート）
- [x] `repositories/taskUserRelationsRepository.ts` 作成（findByTaskId, findByUserId, create, update, softDelete, bulkCreate）
- [x] `repositories/index.ts` 作成（エクスポート）
- [x] `services/taskUserRelations.validator.ts` 作成（validateCreate, validateUpdate, roleType検証, 時間検証, userId存在チェック）
- [x] `services/taskUserRelationsService.ts` 作成（getByTask, getByUser, create, update, softDelete, syncRelations）
- [x] `services/index.ts` 作成（エクスポート）

### Task 7. task_equipment_relations
- [x] `src/server/task-equipment-relations/` フォルダ作成
- [x] `types/taskEquipmentRelations.types.ts` 作成（複合主キー、usageType, plannedHours, actualHours, quantity含む）
- [x] `types/index.ts` 作成（エクスポート）
- [x] `repositories/taskEquipmentRelationsRepository.ts` 作成（findByTaskId, findByEquipmentId, create, update, softDelete, bulkCreate）
- [x] `repositories/index.ts` 作成（エクスポート）
- [x] `services/taskEquipmentRelations.validator.ts` 作成（validateCreate, validateUpdate, usageType検証, 数量検証）
- [x] `services/taskEquipmentRelationsService.ts` 作成（getByTask, getByEquipment, create, update, softDelete, syncRelations）
- [x] `services/index.ts` 作成（エクスポート）

