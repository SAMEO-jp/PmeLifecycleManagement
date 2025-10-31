### ユースケースとServiceメソッドのマッピング

| UC番号  | ユースケース名    | Service         | Serviceメソッド           | ステータス  |
| ----- | ---------- | --------------- | --------------------- | ------ |
| UC-01 | プロジェクト作成   | ProjectsService | `createProject()`     | ✅ 実装済み |
| UC-02 | プロジェクト一覧取得 | ProjectsService | `getAllProjects()`    | ✅ 実装済み |
| UC-03 | プロジェクト詳細取得 | ProjectsService | `getProjectById()`    | ✅ 実装済み |
| UC-04 | プロジェクト更新   | ProjectsService | `updateProject()`     | ✅ 実装済み |
| UC-05 | プロジェクト論理削除 | ProjectsService | `softDeleteProject()` | ✅ 実装済み |
| UC-06 | プロジェクト検索   | ProjectsService | `searchProjects()`    | ⏳ 将来実装 |

### Service分割判断

| 判断項目 | 内容 | 結論 |
|---------|------|------|
| **メソッド数** | 5（将来6） | ✅ 適切 |
| **トランザクション境界** | 単一（一貫） | ✅ 適切 |
| **アクター** | 同一（プロジェクト管理者） | ✅ 適切 |
| **分割判定** | - | **単一Service維持** ✅ |

### 判断理由

| 理由 | 評価 |
|------|------|
| 責務が明確（プロジェクト管理のみ） | ✅ |
| メソッド数が10以下 | ✅ |
| トランザクション境界が一貫 | ✅ |
| 独立して進化する可能性が低い | ✅ |

## 関連ドキュメント

- [03: ユースケース抽出](./03_ユースケース抽出.md)
- [05: Service → Repository 依存関係](./05_Service_Repository_依存関係.md)

