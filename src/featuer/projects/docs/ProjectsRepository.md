---
ファイル種別: repository-layer
クラス名: ProjectsRepository
レイヤー: Repository
ドメイン: Project
テーブル: projects
説明: プロジェクト機能のデータベースアクセスを担当するRepository層
---

# ProjectsRepository

## 概要

プロジェクト機能のデータベースアクセスを担当するRepository層です。

## プロパティ

- **ファイル種別**: repository-layer
- **クラス名**: ProjectsRepository
- **レイヤー**: Repository
- **ドメイン**: Project
- **テーブル**: projects

## メソッド一覧

- [[m.findAll ( )]] - 全プロジェクト取得
- [[m.findById]] - IDでプロジェクト取得
- [[m.create]] - プロジェクト作成
- [[m.update]] - プロジェクト更新
- [[m.softDelete]] - プロジェクト論理削除
- [[m.hardDelete]] - プロジェクト物理削除

## 関連

- [[ProjectsService]] - このRepositoryを使用するService層
- [[05_Service_Repository_依存関係]] - 依存関係の詳細

