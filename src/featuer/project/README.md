# プロジェクト機能設計図 📋

## 概要
プロジェクトの作成・管理・削除を行う機能を提供します。

## 機能要件
- ✅ プロジェクトの新規作成
- ✅ プロジェクトの論理削除（ソフトデリート）
- ✅ プロジェクト情報の取得

## 技術仕様

### データベーススキーマ
```sql
-- projects テーブル（実際のスキーマ）
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  project_name TEXT NOT NULL,
  project_number TEXT NOT NULL UNIQUE, -- PME番号（自動生成）
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP NULL -- 論理削除用
);
```

**注意**: 
- `status`カラムは存在せず、`deleted_at`の有無で状態を判定
- `project_number`は自動生成される（例: PME-20241231-001）

### アーキテクチャ
```
src/featuer/project/
├── services/           # ビジネスロジック層
│   ├── projectsService.ts
│   └── index.ts
├── repositories/       # データアクセス層
│   ├── projectsRepository.ts
│   └── index.ts
├── types/             # 型定義
│   ├── project.types.ts
│   └── index.ts
├── hooks/             # React Hooks（将来実装）
│   ├── useProjects.ts
│   └── index.ts
└── README.md          # 設計ドキュメント
```

## API仕様

### プロジェクト作成
- **エンドポイント**: `POST /api/projects`
- **リクエストボディ**:
```json
{
  "name": "プロジェクト名"
}
```
- **レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "name": "プロジェクト名",
    "projectNumber": "PME-20241231-001",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "プロジェクトが作成されました"
}
```

### プロジェクト論理削除
- **エンドポイント**: `DELETE /api/projects/{id}`
- **動作**: `deleted_at` フィールドに現在時刻を設定
- **レスポンス**:
```json
{
  "success": true,
  "message": "プロジェクトが削除されました"
}
```

## 実装ステップ
1. 型定義の作成
2. Repository層の実装
3. Service層の実装
4. APIエンドポイントの実装
5. React Hooksの実装
6. UIコンポーネントの実装

## エラーハンドリング
- プロジェクト名が空の場合: `400 Bad Request`
- プロジェクトが存在しない場合: `404 Not Found`
- データベースエラーの場合: `500 Internal Server Error`

## セキュリティ考慮事項
- プロジェクト作成時の入力バリデーション
- SQLインジェクション対策（ORM使用）
- 権限チェック（将来的に実装）

## 実装の特徴 ✨

### 防御的プログラミング
- **Repository層でのバリデーション**: Service層だけでなく、Repository層でも基本的なバリデーションを実施
- **二重チェック**: 複数層でのバリデーションにより、安全性を向上

### エラーハンドリング
- **詳細なエラーログ**: スタックトレース、リクエストパラメータ、タイムスタンプを含む詳細なログ
- **エラーメッセージの伝播**: Repository層のバリデーションエラーを適切に上位層に伝播

### 型安全性
- **完全な型定義**: TypeScriptの型システムを活用した型安全な実装
- **DBスキーマとの整合性**: 実際のDBスキーマと型定義の整合性を確保

### 改善点
- ✅ 型とデータのミスマッチを修正（projectNumberを正しく使用）
- ✅ データベーススキーマとコードの不一致を解消
- ✅ Repository層にバリデーションを追加
- ✅ エラーログを詳細化（スタックトレース、リクエスト情報、タイムスタンプ）
- ✅ descriptionフィールドの削除（DBスキーマに存在しないため）
