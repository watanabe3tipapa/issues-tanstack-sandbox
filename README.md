# issues-tanstack-sandbox

**TanStack で「作って試して育てる」サンドボックス。**

TanStack Start の動作を実際に確かめるためのリポジトリです。2 つのサンプルを並行して育てながら、
LP 配信と CMS 運用の 2 パターンを、型安全のまま GitHub Pages 上で公開できるところまで試します。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v0.1.0-blue.svg)](https://github.com/watanabe3tipapa/issues-tanstack-sandbox/releases)
[![GitHub](https://img.shields.io/github/issues/watanabe3tipapa/issues-tanstack-sandbox.svg)](https://github.com/watanabe3tipapa/issues-tanstack-sandbox/issues)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-experiments-orange.svg)](https://tanstack.com/start)

[日本語](README.md)

---

## 概要

本リポジトリは、TanStack Start でできることを「手を動かして確かめる」ためのサンドボックス（実験場）です。**1 リポジトリに 2 つのサブプロジェクト** を置いています。

| サブプロジェクト | テーマ | ひとこと |
| --- | --- | --- |
| [tanstack-start-gh-pages](tanstack-start-gh-pages/) | LP 配信 | SPA モード + プリレンダで静的 LP を GitHub Pages へ |
| [tanstack-start-issues-cms](tanstack-start-issues-cms/) | CMS 運用 | GitHub Issues を記事の管理画面に使う |

どちらも「どう作るか」だけでなく「**どう公開するか**」（GitHub Actions / GitHub Pages）まで含めて実装しています。

## コンセプト（なぜ「サンドボックス」か）

サンドボックスは、本番に出す前に「動くかどうか」を気軽に試すための箱です。本リポジトリも同様に、TanStack Start の機能を **1 つずつ小さく検証** し、うまくいったものを将来のプロジェクトへ移植できる状態で残すことを目的にしています。

- 型安全が実際に「壊れにくさ」に効くのか確かめる
- SSR なしの静的ホスティングでどこまで動くのか確かめる
- GitHub の仕組み（Actions / Pages / Issues）とうまく組み合わさるのか確かめる

検証の記録とノウハウは各サブプロジェクトの **DEV-MEMO** に蓄積しています。

---

## 主な特徴

- **2 パターンの実験** — 「静的 LP 配信」と「Issue 駆動 CMS」を 1 リポジトリで並行開発
- **型安全なルーティング** — TanStack Router のファイルベースルートが、URL ・データ・リンクまで一貫した型でつながる
- **静的プリレンダリング** — 主要ページをビルド時に HTML 化し、サーバー不要で公開
- **GitHub のみで完結** — コードを push すれば、ビルド → デプロイまで自動化
- **アーキテクチャ図** — `/architecture` で、この 2 つの構成の全体像を図解（Archify 利用）

---

## 前提条件

| ツール | 必要バージョン | 確認コマンド |
|---|---:|---|
| Node.js | >= 20 | `node --version` |
| npm | 9 以上（Node 同梱） | `npm --version` |
| Git | 任意（デプロイ・貢献時） | `git --version` |

---

## 開始手順（確認できる事実のみ）

サブプロジェクトごとに独立しています。それぞれのフォルダへ移動してから操作してください。

```bash
# LP 配信側（tanstack-start-gh-pages）
cd tanstack-start-gh-pages
npm install
npm run dev        # http://localhost:3000

# CMS 側（tanstack-start-issues-cms）
cd tanstack-start-issues-cms
npm install
cp .env.example .env
npm run dev
```

デプロイ方法などの詳細は、それぞれの README を参照してください。

---

## リポジトリ構成（主なファイル・ディレクトリ）

```
issues-tanstack-sandbox/
├── .github/workflows/deploy.yml   # LP を gh-pages ブランチへ自動デプロイ
├── LICENSE                        # MIT ライセンス
├── tanstack-start-gh-pages/       # ① LP 配信サンドボックス
├── tanstack-start-issues-cms/     # ② GitHub Issues CMS サンドボックス
└── PLAN/                          # 設計・提案書（ローカル管理）
```

> PLAN/ はリポジトリ管理外（.gitignore 対象）です。各サブプロジェクトの設計背景はローカルの提案書を参照してください。

開発メモ: 各サブプロジェクトの DEV-MEMO.md を参照してください。

---

## ドキュメントと学習順序

1. 本 README — リポジトリ全体の見取り図
2. [tanstack-start-gh-pages/README.md](tanstack-start-gh-pages/README.md) — LP 構成と TanStack の基礎解説
3. [tanstack-start-issues-cms/README.md](tanstack-start-issues-cms/README.md) — Issue 駆動 CMS の仕組み
4. [TanStack Start ドキュメント](https://tanstack.com/start) — 公式リファレンス

---

## コントリビューション

コントリビューションは歓迎します。大きな変更は事前に issue を立ててください。

基本的なワークフロー:

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/your-feature`)
3. 変更をコミット (`git commit -m 'Add your change'`)
4. ブランチをプッシュし、Pull Request を作成

詳細はリポジトリの Issue ページを参照してください。

---

## 連絡先 / 公開サイト

- GitHub: https://github.com/watanabe3tipapa/issues-tanstack-sandbox
- 公開サイト (GitHub Pages, 予定): https://watanabe3tipapa.github.io/issues-tanstack-sandbox/tanstack-start-gh-pages/
  - ※ リポジトリは Public 済み。初回 push 後に Settings → Pages → Deploy from a branch（`gh-pages` / root）を設定すると公開されます

---

## ライセンス

MIT ライセンス — 詳細は [LICENSE](LICENSE) を参照してください。

---

## 開発・保守状態

- リポジトリはアーカイブされていません。
- サブプロジェクトごとの開発メモを、それぞれの DEV-MEMO.md に追録しています。