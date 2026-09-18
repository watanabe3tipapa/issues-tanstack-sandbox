# DEV-MEMO — tanstack-start-gh-pages

TanStack Start の SPA モード + 静的プリレンダリングで GitHub Pages へ LP をデプロイする
サンドボックスの実装メモ。実装のたびに追録していく。

---

## 2026-09-19 — スキャフォールド & SPA モード LP 構築

### やったこと

- PLAN/tanstack-start-gh-pages-proposal.html に沿い、`tanstack-start-gh-pages/` サブディレクトリに構築
  - 公式 CLI `npx @tanstack/cli@latest create --blank` でスキャフォールド
  - 最新構成: `@tanstack/react-start` / react-router（ファイルベース + 型推論）、Vite 8、React 19
- `vite.config.ts` に **SPA モード + 静的プリレンダリング** を設定
  - `tanstackStart({ spa: { enabled: true, prerender: { crawlLinks: true, autoSubfolderIndex: true } } })`
  - `base` = `/tanstack-start-gh-pages/`（env `BASE_PATH` で上書き可）

### 実装ファイル

```
src/routes/__root.tsx     # ルートレイアウト（ヘッダー / フッター / 404）
src/routes/index.tsx      # LP トップ（ヒーロー + 特徴グリッド + CTA）
src/routes/features.tsx   # 機能紹介ページ（01〜06 のカード）
src/styles.css            # ダークテーマ LP
src/router.tsx            # ルーター（scaffold まま）
vite.config.ts            # SPA モード / base 設定
.github/workflows/deploy.yml   # gh-pages ブランチへ自動デプロイ
README.md
```

### ビルド出力（dist/client/）

```
_shell.html          # SPA シェル（404 フォールバック用）
index.html           # プリレンダリング済みトップ
features/index.html  # autoSubfolderIndex により /features 直アクセス対応
assets/*             # base パス付きで解決（/tanstack-start-gh-pages/assets/...）
```

### 検証結果

- `npm run typecheck` クリーン
- `npm run build`: prerender 3 ページ（`/` , `/tanstack-start-gh-pages/`, `/tanstack-start-gh-pages/features`）
- index.html 内のリンク/アセットが `/tanstack-start-gh-pages/` プレフィックスで解決されることを確認

### 技術メモ・落とし穴

1. **SPA モードの設定場所（API 差分）**
   提案書ではトップレベル `prerender.enabled` だが、現行プラグインでは
   `spa.prerender` 配下（`spa.enabled` + `prerender.crawlLinks`）が正しい。
   提案書の API（`prerender.enabled: true` / `autoSubfolderIndex`）は
   現行 `vite.config.ts` では使えないため、`spa.prerender.autoSubfolderIndex` で代替。

2. **404 フォールバック**
   GitHub Pages は動的フォールバック非対応のため、ビルド後に
   `cp dist/client/_shell.html dist/client/404.html` を行い、未到達パスで SPA がハイドレーション遷移する。
   ワークフロー内で自動実行する。

3. **サブディレクトリ base 管理**
   `base` は前後にスラッシュを含める（`/tanstack-start-gh-pages/`）。
   `vite.config.ts` の `base` とプラグイン `client.base` の両方に設定。

4. **CLI のスキャフォールド位置**
   `--target-dir .` はカレントディレクトリ基準。リポジトリルートで実行すると直下に展開されるため、
   `mkdir` + `mv` で `tanstack-start-gh-pages/` へ移動。（**要注意** 前回も同じミス）

5. **`head` ドキュメント管理**
   CSR でも `HeadContent` / `Scripts` をルートレイアウトに置く構成（Start 標準）。
   今回の LP は静的 head（メタ情報のみ）で、`loaderData` 参照は未使用。

### 未解決・今後の課題

- [ ] 実際の GitHub Actions 実行結果の確認（リポジトリへ push 後）
- [ ] OGP 画像・SNS 埋め込みメタの追加
- [ ] フォーム等、サーバー関数が必要な機能は GitHub Pages で使えないため外部サービス連携を検討
- [ ] `features_` などルート追加時のプリレンダリング・crawl 挙動の確認

---

## 2026-09-19 — GitHub Pages 公開のための Actions 措置

### やったこと

- リモートリポジトリ `watanabe3tipapa/issues-tanstack-sandbox`（private）を作成し、`origin` を設定
- ルート `.gitignore` を作成し `PLAN/` を追跡対象外に設定
- `main` ブランチを初期化（コミット前の状態）
- **ワークフローをリポジトリルート `.github/workflows/deploy.yml` に移動・改修**
  - GitHub Actions はルートの `.github/workflows/` しか認識しないため、サブディレクトリ内の定義は無効だった
  - `defaults.run.working-directory: tanstack-start-gh-pages` で各ステップをサブプロジェクトで実行
  - `cache-dependency-path` をサブプロジェクトの `package-lock.json` に指定
- アプリの base が `/tanstack-start-gh-pages/` のため、`gh-pages` ブランチへは **同名ディレクトリ配下** にステージングして展開
  - `deploy/tanstack-start-gh-pages/` ← `dist/client` の内容
  - `deploy/404.html` ← `_shell.html`（サイト全体の SPA フォールバック）
  - `deploy/index.html` ← LP へのリダイレクト（`github.repository_owner` / `github.event.repository.name` から生成）
- サブディレクトリ内の旧 `.github/` を削除

### 変更ファイル

```
.github/workflows/deploy.yml      # 新規（ルート直下）
tanstack-start-gh-pages/.github/  # 削除（無効だった旧ワークフロー）
.gitignore                        # 新規（PLAN/ 除外）
tanstack-start-gh-pages/README.md # 公開手順・URL・ディレクトリ構成を更新
```

### 検証結果

- `YAML.parse` によるワークフロー構文チェック OK
- ステージング手順をローカルで再現し、`deploy/` が `index.html` / `404.html` / `tanstack-start-gh-pages/`（アセット含む）になることを確認
- リダイレクト `index.html` が `https://watanabe3tipapa.github.io/issues-tanstack-sandbox/tanstack-start-gh-pages/` を指すことを確認
- `gh api .../pages` 実行 → **422（Your current plan does not support GitHub Pages for this repository.）**
  プライベートリポジトリのため Pages は未設定（Public 変更後に有効化可能）

### 技術メモ・落とし穴

1. **ネストした `.github/workflows/` は実行されない**
   モノレポでサブプロジェクトにワークフローを置いても GitHub Actions は認識しない。必ずリポジトリルートに配置する。
   → ルートに置き、`defaults.run.working-directory` で対象サブプロジェクトへ切り替えるのが定石。

2. **base とデプロイ先ディレクトリの一致が必須**
   アプリの base が `/tanstack-start-gh-pages/` なので、`gh-pages` ブランチのルートに直接 publish するとアセット 404 になる。
   サイトルートに置く場合は base を `/issues-tanstack-sandbox/` に変える必要がある（現状は提案書どおりサブディレクトリ展開）。

3. **Pages は Public 前提（無料プラン）**
   プライベートリポジトリでは REST API 含め Pages を有効化できない。先に Public へ変更し、
   Settings → Pages → Source: Deploy from a branch（`gh-pages` / root）を設定する。

4. **`peaceiris/actions-gh-pages` は publish_dir の内容でブランチを置換**
   `keep_files` 既定 false のため、複数アプリを同一 `gh-pages` に載せる場合は 1 ワークフローで全アプリをステージングして一括 publish する。

5. **issues-cms 側のワークフローとの競合に注意**
   `tanstack-start-issues-cms/.github/workflows/build.yml` は Actions ソース（`upload-pages-artifact`/`deploy-pages`）想定で、
   Pages のソースを「Deploy from a branch」にする本ワークフローと排他。同一リポジトリで両方を公開する場合は
   どちらか一方の方式に統一する必要がある。

### 未解決・今後の課題

- [x] リポジトリを Public に変更（2026-09-19 実施済み）
- [ ] Pages を有効化（Settings → Pages: Deploy from a branch / `gh-pages`）— gh-pages ブランチ作成後
- [ ] 初回 commit / push 後にワークフロー実行と公開 URL を実機確認
- [ ] issues-cms を公開する場合の方式統一（gh-pages ブランチ集約 or 別リポジトリ）
- [ ] サイトルートに置く `index.html` / `404.html` のメンテナンス方針（自動生成のままか、テンプレート化するか）

---

## 2026-09-19 — Archify によるアーキテクチャ図の追加

### やったこと

- Archify（https://tt-a1i.github.io/archify/）で、このリポジトリを題材にしたアーキテクチャ図を 2 点作成
  1. **issues-cms** — GitHub Issues を CMS として使う構成（Server Functions → ghClient → REST API / Actions → Pages）
  2. **gh-pages** — SPA モード LP のビルド → デプロイ → 配信の全体像
- 仕様 JSON は `tanstack-start-gh-pages/architecture/` に配置し、`showcase` 品質で検証（9 チェック + 可読性 0 エラー）
- 生成 HTML は `public/architecture/*.html` に deliver（単体で開けるスタンドアロン SVG）
- `/architecture` ルートを新設し、2 図を iframe 埋め込みで表示 + 「単体で開く ↗」リンクを提供
- ナビゲーションに **Architecture** を追加

### 変更ファイル

```
tanstack-start-gh-pages/architecture/issues-cms.architecture.json  # 仕様 JSON
tanstack-start-gh-pages/architecture/gh-pages.architecture.json    # 仕様 JSON
tanstack-start-gh-pages/public/architecture/*.html                 # deliver 生成（public 配下）
tanstack-start-gh-pages/src/routes/architecture.tsx                # 新規ルート（iframe 埋め込み）
tanstack-start-gh-pages/src/routes/__root.tsx                      # ナビに Architecture 追加
tanstack-start-gh-pages/src/styles.css                             # iframe 表示用スタイル
tanstack-start-gh-pages/README.md                                  # ルート表 / 構成を更新
```

### 検証結果

- 2 仕様とも `validate --quality showcase` で 9 チェック全通過（composition/desktop-readability を含む）
- `visual-check` でデスクトップ 2 サイズのブラウザ実証 OK（dark/light 両対応・デフォルト dark）
- `npm run typecheck` / `npm run build` クリーン。プリレンダ 6 ページ
  （`/` , `/tanstack-start-gh-pages/` , `/features` , `/architecture` , `/architecture/*.html`）
- `/architecture` の iframe と「単体で開く」リンクが `/tanstack-start-gh-pages/architecture/...` に正しく解決

### 技術メモ・落とし穴

1. **Archify の構成要素は `meta.repository`（40 桁 SHA）が必須**
   `sources`（実コード紐付け）を使うと `meta.repository` 要求エラーになる。
   リポジトリが未コミット（SHA 無し）のため、今回の図では `sources` を使わない。

2. **`meta.locale` は en / zh-CN のみ**
   日本語図でも `locale` は省略する（Viewer の UI は英語フォールバック、図の文言は日本語のまま）。

3. **`composition/desktop-readability`（showcase 必須）で調整**
   1440px ビューポートで context フォントが 6px 未満に縮むとエラー。
   対策は「viewBox 幅を削る（ノードを左へ寄せる）」「ノードを広げる」「ラベルを短くする」。
   今回は 2 図ともノード幅・ノード間 gap（80〜100px）・短いラベルで解決。

4. **プリレンダの crawl が iframe src と単体リンクも辿る**
   `crawlLinks: true` のため `/architecture/*.html` も収集されるが、
   public 配下の実ファイルが優先され上書きされないことを確認済み（差異なし）。

5. **visual-check は HTML の隣に PNG / JSON の証跡を出力する**
   `public/architecture/*.visual-check.*` として生成されるため、配信には不要。
   今回は確認後に削除（必要なら再生成可能）。

### 未解決・今後の課題

- [ ] 図は現時点の設計を手書きで記録したもの。実コード化（issues-cms の実装等）が進んだら
      `sources` + `meta.repository` で実装と紐付ける
- [ ] 二人目以降の図（ワークフロー詳細など）が必要になったら追記

---

## 追録テンプレート（今後この形式で追記する）

```
## YYYY-MM-DD — <変更の要約>

### やったこと
### 実装ファイル / 変更ファイル
### 検証結果
### 技術メモ・落とし穴
### 未解決・今後の課題
```