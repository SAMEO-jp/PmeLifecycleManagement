---
ファイル種別: service-layer
クラス名: ProjectsService
レイヤー: Service
ドメイン: Project
依存先: ProjectsRepository
説明: プロジェクト機能のビジネスロジックを担当するService層
---

# ProjectsService

## 概要

プロジェクト機能のビジネスロジックを担当するService層です。

## プロパティ

- **ファイル種別**: service-layer
- **クラス名**: ProjectsService
- **レイヤー**: Service
- **ドメイン**: Project
- **依存先**: ProjectsRepository

## メソッド一覧

- [[createProject]] - プロジェクト作成
- [[getAllProjects]] - プロジェクト一覧取得
- [[getProjectById]] - プロジェクト詳細取得
- [[updateProject]] - プロジェクト更新
- [[softDeleteProject]] - プロジェクト論理削除

## 関連

- [[ProjectsRepository]] - 依存するRepository層
- [[05_Service_Repository_依存関係]] - 依存関係の詳細

