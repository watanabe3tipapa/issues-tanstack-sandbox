import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start × GitHub Pages',
      },
      {
        name: 'description',
        content:
          'TanStack Start の SPA モード + 静的プリレンダリングで構築する LP テンプレート',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container">
      <section className="not-found">
        <h1>404</h1>
        <p>お探しのページが見つかりませんでした。</p>
        <Link to="/" className="btn">
          トップへ戻る
        </Link>
      </section>
    </main>
  ),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        <header className="site-header">
          <div className="container site-header-inner">
            <Link to="/" className="site-title">
              <span className="site-title-mark">◈</span>
              TanStack Start LP
            </Link>
            <nav className="site-nav">
              <Link
                to="/"
                className="site-nav-link"
                activeOptions={{ exact: true }}
              >
                Top
              </Link>
              <Link to="/features" className="site-nav-link">
                Features
              </Link>
              <Link to="/architecture" className="site-nav-link">
                Architecture
              </Link>
            </nav>
          </div>
        </header>
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            <span>TanStack Start ✦ GitHub Pages ✦ SPA Mode ✦ Type Safe ✦ Static Prerender ✦ </span>
            <span>TanStack Start ✦ GitHub Pages ✦ SPA Mode ✦ Type Safe ✦ Static Prerender ✦ </span>
          </div>
        </div>
        {children}
        <footer className="site-footer">
          <div className="container">
            <p>
              TanStack Start × GitHub Pages — SPA mode + Static Prerendering
            </p>
            <p className="site-footer-sub">
              GitHub Actions で <code>gh-pages</code> ブランチへ自動デプロイ
            </p>
          </div>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}