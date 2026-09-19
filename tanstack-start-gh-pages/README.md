# tanstack-start-gh-pages

**TanStack の型安全を、そのまま GitHub Pages へ。**

TanStack Start の **SPA モード + 静的プリレンダリング** で構築する LP テンプレートです。
GitHub Actions がビルドし、`gh-pages` ブランチ経由で GitHub Pages のサブディレクトリ
（`/tanstack-start-gh-pages/`）へ自動デプロイします。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)
[![Version](https://img.shields.io/badge/version-v0.1.0-blue.svg)](https://github.com/watanabe3tipapa/issues-tanstack-sandbox/releases)
[![GitHub](https://img.shields.io/github/issues/watanabe3tipapa/issues-tanstack-sandbox.svg)](https://github.com/watanabe3tipapa/issues-tanstack-sandbox/issues)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-SPA%20mode-orange.svg)](https://tanstack.com/start)

[日本語](README.md)

---

## 概要

TanStack のフルスタックフレームワーク TanStack Start を使い、**メイン画面をクライアントで動かし（SPA モード）、主要なページをあらかじめ HTML 化（プリレンダリング）** して配信する、LP 向けの構成です。

1 つのソース（ルート定義）から、初回表示の速い静的 HTML と、遷移の速いクライアントアプリの **両方の良さ** を取り出します。「SSR 用のサーバーが要らない LP に、いちばん軽い構成」を具体化したものです。

## コンセプト（なぜ「TanStack」か）

TanStack は、フロントエンド開発の「土台（インフラ）」を担うオープンソースの TypeScript ライブラリ群です。見た目を持たず（ヘッドレス）、組み合わせ自由で、何より **型安全** であることを共通の設計思想にしています。

本テンプレートはその中心である **Router（型安全ルーティング）** と、その上に載る **Start（フレームワーク）** を採用し、「型が通っていればリンクもデータも壊れない」という世界観を、静的ホスティングの GitHub Pages 上でも丸ごと体験できるようにしました。

---

## 主な特徴

- **SPA モード** — SSR が不要な LP 向け。ビルド後に shell HTML（`_shell.html`）を生成
- **静的プリレンダリング** — 主要ルート（`/` ・ `/features` ・ `/architecture`）をビルド時に HTML 化
- **base パス管理** — サブディレクトリ配下のデプロイ前提で、`vite.config.ts` の `base` を `/tanstack-start-gh-pages/` に設定し、本番ビルドでは `BASE_PATH` で repo プレフィックス付き絶対パスへ補正
- **404 フォールバック** — `_shell.html` を `404.html` としてコピーし、未到達パスでも SPA がハイドレーション遷移できます
- **自動デプロイ** — リポジトリルートの GitHub Actions が、ビルド → 404 生成 → `gh-pages` ブランチ展開までを 1 回の push で完結
- **アーキテクチャ図ページ** — `/architecture` で、この構成と CMS の構造を Archify の図として掲載
- **Neo Brutalism テーマ** — 太いボーダー・ハードシャドウ・原色ブロックの LP デザイン

---

## 技術スタック：TanStack を、わかりやすく説明

「TanStack」と聞くと、なんだか難しそうに感じるかもしれません。順に読めば大丈夫です。

### 1. TanStack とは、こんなものです

TanStack は **「画面づくりに必要な部品」を、見た目抜きでまとめたセット** です。
部品は「中の動き」だけを担当し、「見た目」には一切ふれません。だから、どんなデザインにも自分の好きなように組み込めます。

料理で言えば「だし」のような存在。味の土台はしっかり用意してくれますが、盛り付けは自分で決められる、というイメージです。

| 部品 | 役割 | 身近なたとえ |
| --- | --- | --- |
| Router（ルーター） | URL と画面の対応づけ | 「この道はあのページへ」の案内図 |
| Start | アプリ全体を仕上げて配信用ファイルにする | 組み立て工場のライン |
| Query | サーバーからデータを取ってくる | 配達係 |
| Table | たくさんのデータを表で扱う | 集計帳 |
| Virtual | 何万件もの一覧を軽く表示する | 見える範囲だけを映すズームレンズ |
| Form | 入力欄の管理・チェック | 受付窓口 |

React だけでなく、Vue・Svelte・Solid といった他の画面技術にも対応しています。

### 2. この LP では、2 つの部品を使っています

1 つ目は **Router（案内図）**。ページを「ファイル名」から自動で読み取ります。

- `index.tsx` → トップページ（`/`）
- `features.tsx` → 特長ページ（`/features`）
- `architecture.tsx` → 構成図ページ（`/architecture`）

「ページを足したい」ときは、**ファイルを 1 つ増やすだけ**。URL やリンクも自動的につながります。

2 つ目は **Start（組み立て工場）**。Router をもとにページを組み上げ、ビルド・開発用サーバー・ページの HTML 化までを一手に引き受けます。

GitHub Pages は「作り終えたファイルを置いておくだけ」の場所です。そこで Start の **SPA モード** を使い、特別なサーバーがなくても動く形で仕上げています。

### 3. 「型安全」で、何がしあわせになるのか

「型安全」を一言でいうと、**「書いている最中に、間違いを教えてくれる」** 仕組みです。

ふつうの Web 制作では、リンク切れやデータの形式違いといったミスを **公開してから、ブラウザで見て初めて** 気づきます。型安全なら、ファイルを保存した瞬間に「ここ、違うよ」と教えてくれます。

- 存在しないページへのリンク → 書いた瞬間にエラー表示
- データの中身の指定を間違えた → 形が合わないと即座に警告
- ページ名を変更しても → 関連する場所がまとめて直る
- 「何を渡せばいいの？」 → 候補が自動で出てくる

つまり **「型が通っていれば、きっと動く」** という安心が、作業している段階で手に入ります。ページが増えれば増えるほど、この安心が効きます。

---

## 前提条件

| ツール | 必要バージョン | 確認コマンド |
|---|---:|---|
| Node.js | >= 20 | `node --version` |
| npm | 9 以上（Node 同梱） | `npm --version` |
| Git | 任意（デプロイ・貢献時） | `git --version` |

---

## 開始手順（確認できる事実のみ）

1. 依存をインストール:

```bash
npm install
```

2. 開発サーバー（http://localhost:3000）:

```bash
npm run dev
```

3. 本番ビルド（SPA モード + プリレンダリング）:

```bash
npm run build
```

出力例:
- `dist/client/` — 静的成果物（`_shell.html` / `index.html` / `features/` など）
- `dist/client/assets/` — base パス付きで解決済みのアセット

4. ビルド成果物の確認:

```bash
npm run preview
```

SPA フォールバック用の 404 は、デプロイ時に CI が自動生成します。

```bash
cp dist/client/_shell.html dist/client/404.html
```

### base パス

デフォルトは `/tanstack-start-gh-pages/` です。環境変数 `BASE_PATH` で上書きできます。

```bash
BASE_PATH=/tanstack-start-gh-pages/ npm run build   # ローカル（バイロット購入前の確認用）
BASE_PATH=/issues-tanstack-sandbox/tanstack-start-gh-pages/ npm run build  # 本番相当（repo プレフィックス付き）
```

本番ビルドでは GitHub Pages の実際の配置パス（`https://<user>.github.io/<repo>/tanstack-start-gh-pages/`）に
**repo プレフィックス付きの絶対パス**が必要です。CI は `BASE_PATH=/${GITHUB_REPOSITORY##*/}/...` で自動解決します
（アプリの base と実配置がズレると、アセット・iframe がすべて 404 になります）。

### GitHub Pages への公開

> **前提**: GitHub Pages を利用するにはリポジトリが **Public** である必要があります。
> このリポジトリは Public に設定済みです。下記の手順で Pages を有効化してください。

1. リポジトリ設定で GitHub Pages を有効化
   - Settings → Pages → Source: **Deploy from a branch**
   - Branch: `gh-pages`、ディレクトリ: `/`（root）
2. `main` ブランチへの push で **リポジトリルート** の `.github/workflows/deploy.yml` が自動実行されます
   - ビルド → `404.html` 生成 → `tanstack-start-gh-pages/` 配下にステージング → `peaceiris/actions-gh-pages` で `gh-pages` へ展開
   - サイトルートには LP へのリダイレクト `index.html` と SPA 用 `404.html` を配置
3. 公開 URL: `https://<user>.github.io/issues-tanstack-sandbox/tanstack-start-gh-pages/`
   - 本番ビルドは `BASE_PATH=/issues-tanstack-sandbox/tanstack-start-gh-pages/` で生成され、`gh-pages` ブランチの同名ディレクトリ配下へ展開されます

---

## ルート（ページ）

| パス | 内容 |
| --- | --- |
| `/` | LP トップ（ヒーロー + 特徴グリッド + CTA） |
| `/features` | 構成の主要ポイント・型安全の効能紹介 |
| `/architecture` | Archify によるアーキテクチャ図（iframe 埋め込み + 単体で開くリンク） |

ルートを 1 ファイル追加（例: `src/routes/about.tsx`）するだけで、プリレンダリングと型付きリンクが自動で追従します。

---

## リポジトリ構成（主なファイル・ディレクトリ）

```
リポジトリルート/
├── .github/workflows/deploy.yml   # gh-pages ブランチへ自動デプロイ（※リポジトリルートにある）
└── tanstack-start-gh-pages/
    ├── src/
    │   ├── routes/
    │   │   ├── __root.tsx     # ルートレイアウト（ヘッダー / フッター / 404）
    │   │   ├── index.tsx      # LP トップ
    │   │   ├── features.tsx   # 機能紹介ページ
    │   │   └── architecture.tsx   # アーキテクチャ図ページ
    │   ├── router.tsx         # ルーター設定
    │   └── styles.css         # Neo Brutalism テーマ LP
    ├── architecture/          # Archify 仕様 JSON（図の元データ・検証対象）
    ├── public/
    │   └── architecture/      # Archify 生成の単体 HTML（iframe 埋め込みに使用）
    ├── package.json
    └── vite.config.ts         # SPA モード + base 設定
```

> ワークフローは GitHub Actions が認識するよう **リポジトリルートの `.github/workflows/`** に配置しています（サブディレクトリ内では実行されません）。

開発メモ: DEV-MEMO.md を参照してください。

---

## ドキュメントと学習順序

まずは以下を順に読むと全体像が掴みやすいです:

1. この README — 構成と開始手順
2. [`/features`](https://watanabe3tipapa.github.io/issues-tanstack-sandbox/tanstack-start-gh-pages/features) — 型安全・SPA・プリレンダリングの効能
3. 提案書（PLAN/tanstack-start-gh-pages-proposal.html）— 設計の背景
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

MIT ライセンス — 詳細は [LICENSE](../LICENSE)（リポジトリルート）を参照してください。

---

## 開発・保守状態

- リポジトリはアーカイブされていません。
- 開発メモは DEV-MEMO.md に追録されています。