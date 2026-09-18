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
        title: 'TanStack Start + GitHub Issues CMS',
      },
      {
        name: 'description',
        content: 'GitHub Issues を CMS として利用する TanStack Start のサンドボックス',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
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
              <span className="site-title-mark">🔷</span>
              TanStack Start × GitHub Issues CMS
            </Link>
            <nav className="site-nav">
              <Link to="/" className="site-nav-link" activeOptions={{ exact: true }}>
                Posts
              </Link>
              <a
                className="site-nav-link"
                href={githubRepoUrl()}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <p>
            Powered by TanStack Start · Built with GitHub Issues as a CMS
          </p>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <main className="container">
      <div className="not-found">
        <h1>404</h1>
        <p>ページが見つかりませんでした。</p>
        <Link to="/">記事一覧に戻る</Link>
      </div>
    </main>
  )
}

function githubRepoUrl() {
  if (typeof process === 'undefined') return undefined
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  return owner && repo ? `https://github.com/${owner}/${repo}` : undefined
}