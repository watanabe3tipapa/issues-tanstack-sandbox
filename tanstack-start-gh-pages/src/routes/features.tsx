import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/features')({
  head: () => ({
    meta: [
      {
        title: 'Features | TanStack Start × GitHub Pages',
      },
      {
        name: 'description',
        content:
          'TanStack Start × GitHub Pages 構築の主要機能と設定ポイントの紹介です。',
      },
    ],
  }),
  component: Features,
})

const items = [
  {
    title: '型安全なルーティング',
    body: 'TanStack Router のファイルベースルーティングと型推論により、パス・パラメータ・検索クエリ・ローダーまで一貫した型安全性を確保。リファクタリング時の破壊的変更をビルド前に検出できます。',
  },
  {
    title: 'SPA モード',
    body: 'SSR を必要としない LP では、SPA モードを有効化して shell HTML を生成。クライアントでハイドレーションされたルーターが高速な画面遷移を担います。',
  },
  {
    title: '静的プリレンダリング',
    body: 'ビルド時に主要ルートを HTML 化し、初回アクセスでもコンテンツが即座に表示されます。SEO とキャッシュ効率も向上します。',
  },
  {
    title: 'base パス管理',
    body: 'サブディレクトリ配下へデプロイするため vite.config.ts の base を /tanstack-start-gh-pages/ に設定。アセットパスの解決を厳密に行います。',
  },
  {
    title: '404 フォールバック',
    body: 'GitHub Pages は動的フォールバック非対応のため、_shell.html を 404.html として配置。未到達パスでも SPA が正しいルートへ遷移します。',
  },
  {
    title: 'ポータビリティ',
    body: 'ルート定義とサーバー境界を維持したまま、将来は Cloudflare / Netlify / Node.js などへスムーズに移行できます。',
  },
] as const

function Features() {
  return (
    <main className="container">
      <section className="page-head">
        <p className="eyebrow">Features</p>
        <h1>この構成の主要ポイント</h1>
        <p className="page-lead">
          TanStack Start × GitHub Pages の SPA + プリレンダリング構成が提供する機能と設定を紹介します。
        </p>
      </section>

      <section className="section">
        <div className="features-list">
          {items.map((item, i) => (
            <article className="features-item" key={item.title}>
              <span className="features-index">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-cta">
        <div className="cta-panel">
          <h2>この LP をデプロイする</h2>
          <p>
            リポジトリルートに配置する GitHub Actions が、
            ビルド → <code>404.html</code> 生成 → <code>gh-pages</code> ブランチへ展開 を自動化します。
          </p>
          <Link to="/" className="btn btn-primary">
            トップへ戻る
          </Link>
        </div>
      </section>
    </main>
  )
}