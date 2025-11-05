# Git プッシュ設定ガイド

## 現在のリモート設定

- **origin**: `SAMEO-jp/PmeLifecycleManagement` (個人開発ブランチ)
- **upstream**: `pme-dev-system/PmeLifecycleManagement` (組織開発ブランチ)

## プッシュ設定オプション

### オプション1: 組織リポジトリ（upstream）にプッシュする設定

開発作業を組織リポジトリに直接プッシュする場合：

```bash
# デフォルトのプッシュ先を upstream に変更
git push -u upstream master

# または、ブランチごとに設定
git branch --set-upstream-to=upstream/master master
```

### オプション2: 個人リポジトリ（origin）にプッシュする設定（現在の設定）

個人のリポジトリで開発してから組織にマージする場合：

```bash
# 現在の設定（デフォルト）
git push origin master

# upstream にマージする場合は、GitHub上でプルリクエストを作成
```

### オプション3: 両方にプッシュする設定

両方のリポジトリに同時にプッシュする場合：

```bash
# リモートを追加（既に追加済み）
git remote add upstream https://github.com/pme-dev-system/PmeLifecycleManagement.git

# 両方にプッシュするエイリアスを作成
git config alias.pushall '!git push origin && git push upstream'
```

## 推奨ワークフロー

### 開発フロー

1. **フィーチャーブランチで開発**:
   ```bash
   git checkout -b feature/機能名
   ```

2. **個人リポジトリ（origin）にプッシュ**:
   ```bash
   git push origin feature/機能名
   ```

3. **組織リポジトリ（upstream）にプルリクエストを作成**:
   - GitHub上で `pme-dev-system/PmeLifecycleManagement` にプルリクエストを作成
   - レビュー後にマージ

### 直接プッシュする場合

組織リポジトリに直接プッシュする権限がある場合：

```bash
# upstream にプッシュ
git push upstream master

# または、ブランチを設定
git push -u upstream master
```

## 現在の設定

```bash
# プッシュ設定を確認
git config --get push.default

# リモート設定を確認
git remote -v

# ブランチのトラッキングを確認
git branch -vv
```

## 設定の変更方法

### デフォルトのプッシュ先を変更する場合

```bash
# upstream をデフォルトに設定
git config push.default upstream

# または、ブランチごとに設定
git branch --set-upstream-to=upstream/master master
```

### 設定をリセットする場合

```bash
# 設定を削除
git config --unset push.default
git config --unset branch.master.remote
git config --unset branch.master.merge
```

## 注意事項

- **upstream に直接プッシュする場合**: 組織のリポジトリに直接変更を加えるため、慎重に行ってください
- **個人リポジトリ（origin）にプッシュする場合**: 個人のリポジトリで作業し、プルリクエスト経由で統合するのが安全です
- **権限の確認**: upstream にプッシュする権限があるか確認してください

