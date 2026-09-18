import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: 'TanStack Start × GitHub Pages | 型安全な LP 開発',
      },
      {
        name: 'description',
        content:
          'TanStack Start の SPA モードと静的プリレンダリングで構築する、型安全で高速な LP テンプレート。',
      },
    ],
  }),
  component: Home,
})

const features = [
  {
    icon: '🧭',
    title: '型安全なルーティング',
    description:
      'パラメータ・検索クエリ・ローダーまでエンドツーエンドで型が繋がります。',
  },
  {
    icon: '⚡',
    title: 'SPA モード + 静的配信',
    description:
      'SSR 不要の LP に最適。ビルド後は静的アセットのみを CDN で配信します。',
  },
  {
    icon: '🖨️',
    title: '静的プリレンダリング',
    description:
      '主要ルートをビルド時に HTML 化。SEO と初回表示速度を両立します。',
  },
] as const

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">TanStack Start × GitHub Pages</p>
          <h1>
            型安全 × 高速配信
            <br />
            <span className="gradient">SPA モードで LP をビルド</span>
          </h1>
          <p className="hero-lead">
            TanStack Router の中核を活用したフルスタックフレームワーク
            TanStack Start。GitHub Pages という静的ホスティング上でも、
            SPA モードとプリレンダリングにより、型安全で高速な LP を実現します。
          </p>
          <div className="hero-actions">
            <Link to="/features" className="btn btn-primary">
              Features を見る
            </Link>
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              公式ドキュメント ↗
            </a>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section section-cta">
        <div className="cta-panel">
          <h2>GitHub Pages へ自動デプロイ</h2>
          <p>
            main ブランチへの push をトリガーに、Actions がビルドして{' '}
            <code>gh-pages</code> ブランチへ展開。
            <span className="cta-path">/tanstack-start-gh-pages/</span>
            配下で公開できます。
          </p>
          <Link to="/features" className="btn btn-primary">
            詳しい機能へ
          </Link>
        </div>
      </section>
    </main>
  )
}