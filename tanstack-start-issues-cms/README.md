# tanstack-start-issues-cms

GitHub Issues を CMS として利用する **TanStack Start** のサンドボックスです。

`issues-astro-cms` のアーキテクチャを TanStack Start に移植し、型安全なルーティング・Server Functions・SSR / プリレンダリングを試せる構成になっています。

## 動作の仕組み

1. GitHub リポジトリで `status:published` ラベル付き Issue を作成
2. TanStack Start の Server Function (`createServerFn`) が GitHub REST API から `status:published` の Issue を取得
3. Issue 本文冒頭の YAML frontmatter を解析して `Post` に変換
4. 開発時は SSR、GitHub Pages デプロイ時はビルド時に全ページをプリレンダリング

## 必要なもの

- `status:published` / `status:draft` ラベル（Issue テンプレートは `.github/ISSUE_TEMPLATE/blog-post.md`）
- 環境変数（`.env.example` 参照）

| 変数 | 必須 | 説明 |
| --- | --- | --- |
| `GITHUB_OWNER` | 必須 | GitHub のオーナー名（ユーザー名 or 組織名） |
| `GITHUB_REPO` | 必須 | リポジトリ名 |
| `GITHUB_TOKEN` | 任意 | レート制限緩和用（60 → 5000 req/hr） |
| `BASE_PATH` | 任意 | 静的ビルド時のベースパス。GitHub Pages では `/リポジトリ名/` |
| `STATIC_EXPORT` | 任意 | `true` で静的プリレンダリングビルド |

## ローカル開発

```bash
npm install
cp .env.example .env   # GITHUB_OWNER / GITHUB_REPO を設定
npm run dev            # http://localhost:3000 （SSR で動作）
```

> `.env` を Vite が読み込むため、サーバー実行時にも環境変数が反映されます。

## ビルドとプレビュー

```bash
npm run build          # SSR 用ビルド（デフォルト）
npm run build:static   # GitHub Pages 向け静的プリレンダリング（STATIC_EXPORT=true）

# 静的ビルドの例
GITHUB_OWNER=<owner> GITHUB_REPO=<repo> \
STATIC_EXPORT=true BASE_PATH=/<repo>/ npm run build:static
```

静的出力は `dist/client/` に生成されます。

## GitHub Pages への公開

1. リポジトリで GitHub Pages を有効化（Settings > Pages > Build and deployment > Source を GitHub Actions に設定）
2. ラベル `status:published` / `status:draft` を作成
3. `.github/workflows/build.yml` を有効化

Issue の `opened` / `edited` / `labeled` / `unlabeled` / `closed` などをトリガーに、
ラベル検証 → 静的ビルド（プリレンダリング）→ `dist/client` を公開します。

```bash
npm run validate-labels   # 必須ラベルの存在チェック（.github/workflows 内でも実行）
```

## Issue テンプレート

`.github/ISSUE_TEMPLATE/blog-post.md` を配置済みです。
記事は Issue 本文冒頭の YAML frontmatter でメタデータを指定します。

```md
---
slug: example-post
title: 記事タイトル
excerpt: 一覧に表示される要約
tags:
  - tanstack-start
  - github-issues
publishedAt: 2026-01-01
author: your-name
---

ここから記事本文（Markdown）
```

`status:published` ラベルを付けると公開されます。

## ディレクトリ構成

```
src/
├── routes/
│   ├── __root.tsx           # ルートレイアウト（header / footer / 404）
│   ├── index.tsx            # 記事一覧
│   └── posts.$slug.tsx      # 記事詳細（ダイナミックルート）
├── components/
│   ├── PostCard.tsx         # 記事カード
│   ├── PostList.tsx         # 記事一覧コンポーネント
│   └── MarkdownBody.tsx     # Markdown レンダリング（react-markdown + remark-gfm）
├── lib/
│   ├── types.ts             # 共有型定義（GitHubIssue / Post）
│   ├── issues.ts            # Issue → Post 変換（gray-matter）
│   └── github.server.ts     # GitHub REST API クライアント（サーバーのみ）
├── server/
│   └── functions.ts         # createServerFn 定義（getPosts / getPostBySlug）
├── router.tsx               # ルーター
└── styles.css               # GitHub Issues 風デザイン
scripts/
└── validate-labels.mjs      # ラベル検証スクリプト
.github/
├── workflows/build.yml      # Issue イベントで静的ビルド & GitHub Pages デプロイ
└── ISSUE_TEMPLATE/blog-post.md
```

## 参考

- [issues-astro-cms（元ネタの Astro 版）](https://github.com/watanabe3tipapa/issues-astro-cms)
- [提案書（PLAN/）](../PLAN/tanstack-start-issues-cms-proposal.html)