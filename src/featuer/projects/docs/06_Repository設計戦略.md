# 06: Repository設計戦略 🏗️

## STEP 5: Repository設計戦略

```
┌──────────────────────────────────────────────────────┐
│          Repository設計：アプローチB（推奨）          │
└──────────────────────────────────────────────────────┘

【採用アプローチ】
コンポジション（推奨）
  └─ ORM（Drizzle）の型安全性を活かす
  └─ 各Repositoryが完全に独立
  └─ テスト・モックが容易

ProjectsRepository
  │
  ├─ 基本CRUD
  │   ├─ findById(id, options?)
  │   ├─ findAll(options?)
  │   ├─ create(data)
  │   ├─ update(id, data)
  │   └─ softDelete(id)
  │
  └─ ドメイン固有クエリ
      ├─ getNextProjectNumber()
      │   └─ PME番号の自動生成ロジック
      └─ mapToProjectTable(row)
          └─ DB行をDomain型にマッピング

【設計判断】
├─ 汎用CRUD層: 作らない ✅
│  └─ ORM APIで十分
├─ ドメイン固有メソッド: 作る ✅
│  ├─ getNextProjectNumber() - ビジネスロジック
│  └─ mapToProjectTable() - データ変換
└─ 過剰な抽象化: 避ける ✅
```

## 関連ドキュメント

- [05: Service → Repository 依存関係](./05_Service_Repository_依存関係.md)
- [07: 設計判断マトリクス](./07_設計判断マトリクス.md)

