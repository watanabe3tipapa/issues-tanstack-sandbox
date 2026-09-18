# DEV-MEMO — tanstack-start-issues-cms

GitHub Issues を CMS として利用する TanStack Start サンドボックスの実装メモ。
実装のたびに追録していく。

---

## 2026-09-19 — 初回スキャフォールド & CMS 基盤実装

### やったこと

- PLAN/ の提案書に沿い、`tanstack-start-issues-cms/` サブディレクトリに TanStack Start プロジェクトを構築
  - 公式 CLI `npx @tanstack/cli@latest create --blank` でスキャフォールド
  - バージョン: `@tanstack/react-start` 1.168.56 / react-router 1.170.38 / Vite 8 / React 19 / TS 6
- 依存追加: `gray-matter`（frontmatter 解析）、`react-markdown` + `remark-gfm`（Markdown 描画）、`@tanstack/start-static-server-functions`（静的ビルド用）

### 実装ファイル

```
src/
├── routes/
│   ├── __root.tsx           # ルートレイアウト（header / footer / 404）+ GitHub リンク
│   ├── index.tsx            # 記事一覧（loader で getPosts）
│   └── posts.$slug.tsx      # 記事詳細（loader で getPostBySlug、notFound で 404）
├── components/
│   ├── PostCard.tsx / PostList.tsx / MarkdownBody.tsx
├── lib/
│   ├── types.ts             # GitHubIssue / Post
│   ├── github.server.ts     # GitHub REST API クライアント（.server.ts でサーバー限定）
│   └── issues.ts            # Issue → Post 変換（gray-matter）
├── server/
│   └── functions.ts         # createServerFn（getPosts / getPostBySlug）
├── env.d.ts                 # process.env の型定義
└── styles.css               # GitHub Issues 風デザイン（変数ベース）
scripts/validate-labels.mjs    # status:published / status:draft の存在検証
.github/workflows/build.yml    # Issue イベントで静的ビルド → GitHub Pages デプロイ
.github/ISSUE_TEMPLATE/blog-post.md
.env.example
README.md
```

### 検証結果（watanabe3tipapa/issues-astro-cms を利用）

- `npm run typecheck` クリーン
- dev（SSR）: 一覧 200 / 詳細 200 / 存在しない slug → 404
- `npm run build:static`（STATIC_EXPORT=true）: 8 ページをプリレンダリングし `dist/client` に出力
- BASE_PATH 付きビルドでリンク/アセットが `/issues-tanstack-sandbox/...` に解決されることを確認

### 技術メモ・落とし穴

1. **`*.server.ts` はクライアントから import 禁止**
   ルートから `functions.server.ts` を import すると import-protection に弾かれる。
   規約として「`createServerFn` は非 `.server` ファイル（`src/server/functions.ts`）に置く」。
   GitHub API アクセス（トークン保持）は `src/lib/github.server.ts` に分離し、ハンドラ経由でのみ使用。

2. **frontmatter の Date 型落とし穴**
   YAML で `publishedAt: 2026-01-01` と書くと gray-matter が `Date` オブジェクトとして返す。
   React が Date を children に描画できず `Objects are not valid as a React child` でビルド失敗。
   → `issues.ts` で `toDateString()` / `toString()` / `toTags()` による正規化を実装。

3. **`head` からの `loaderData` 参照が型解決できない（要調査）**
   `head: ({ loaderData }) => ...` や `match.loaderData` を使うと、そのルート全体で
   `TLoaderFn` の推論が `never` に落ちて typecheck が失敗する。
   現在は `$slug.tsx` の head を静的タイトルにフォールバック。
   （公式ドキュメントに loaderData 参照の例がなく、公式 example でも使われていない。要検証項目）

4. **GitHub Pages 用ビルドフロー**
   `.env` は Vite が読み込むため、server side の `process.env` にも反映される（ローカル検証で確認）。
   Actions では `GITHUB_OWNER / GITHUB_REPO / GITHUB_TOKEN / BASE_PATH` を env で注入。
   静的出力は `upload-pages-artifact` が `dist/client/` を参照。

### 未解決・今後の課題

- [ ] `head` + `loaderData` で動的タイトル化（TS 型推論問題の調査）
- [ ] タグ別アーカイブページ `/tags/$tag` の追加（提案書「今後の拡張」）
- [ ] ページネーション（Issue 数増加時）
- [ ] TanStack Query との組み合わせ（キャッシュ戦略）
- [ ] Discussions 対応 / OGP 動的生成

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