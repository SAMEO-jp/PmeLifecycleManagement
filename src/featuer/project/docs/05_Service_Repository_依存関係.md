# 05: Service → Repository 依存関係 🔍

## STEP 4: Service → Repository 依存関係

### 思考プロセス

1. Serviceメソッドを列挙
2. 各メソッドが触るテーブルを特定
3. テーブル単位でRepositoryを定義

---

### Service → Repository 依存関係

プロジェクト機能は**単一Repositoryパターン**に該当します。

#### ServiceとRepositoryの概要

| Service | Repository | テーブル |
|---------|-----------|---------|
| ProjectsService | ProjectsRepository | projects |

#### メソッド対応マトリクス

| ProjectsService        | ProjectsRepository | 用途              |
| ---------------------- | ------------------ | ----------------- |
| `createProject()`      | `create()`         | プロジェクト作成       |
| `getAllProjects()`     | `findAll()`        | プロジェクト一覧取得     |
| `getProjectById()`     | `findById()`       | プロジェクト詳細取得     |
| `updateProject()`      | `update()`         | プロジェクト更新       |
| `softDeleteProject()`  | `softDelete()`     | プロジェクト論理削除     |
| `searchProjects()`     | `search()`         | プロジェクト検索       |
| -                      | `hardDelete()`     | プロジェクト物理削除（管理用） |

**特徴**:
- ✅ 1つのServiceが1つのRepositoryのみに依存
- ✅ 単一テーブル（projects）のみを操作
- ✅ シンプルで理解しやすい構造

---

### Repository作成の原則

| 原則 | プロジェクト機能での適用 | 評価 |
|------|---------------------|------|
| 1テーブル = 1Repository | projectsテーブル → ProjectsRepository | ✅ |
| 単一テーブルで完結 | JOIN不要 | ✅ |
| テーブル単位でRepository定義 | 独立したRepository | ✅ |

## 関連ドキュメント

- [04: ユースケース → Service マッピング](./04_ユースケース_Service_マッピング.md)
- [06: Repository設計戦略](./06_Repository設計戦略.md)

