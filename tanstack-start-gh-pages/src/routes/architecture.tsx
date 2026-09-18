import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/architecture')({
  head: () => ({
    meta: [
      {
        title: 'Architecture | TanStack Start × GitHub Pages',
      },
      {
        name: 'description',
        content:
          'このリポジトリの GitHub Issues CMS と、SPA + プリレンダ構成の GitHub Pages LP のアーキテクチャ図です。',
      },
    ],
  }),
  component: Architecture,
})

const base = import.meta.env.BASE_URL

const diagrams = [
  {
    id: 'issues-cms',
    title: 'GitHub Issues CMS',
    lead: 'GitHub Issues を CMS として使う構成。Server Functions が REST API 経由で Issue を取得し、gray-matter で記事へ変換します。',
    file: `${base}architecture/issues-cms.html`,
  },
  {
    id: 'gh-pages',
    title: 'SPA モード × GitHub Pages デプロイ',
    lead: 'GitHub Actions がビルドして gh-pages へ展開。base パス配下で SPA シェルを配信する全体像です。',
    file: `${base}architecture/gh-pages.html`,
  },
] as const

function Architecture() {
  return (
    <main className="container">
      <section className="page-head">
        <p className="eyebrow">Architecture</p>
        <h1>このリポジトリのアーキテクチャ</h1>
        <p className="page-lead">
          TanStack Start × GitHub Pages の LP と、そのコンテンツ源である
          GitHub Issues CMS を図解します。
        </p>
      </section>

      {diagrams.map((diagram) => (
        <section className="section arch-section" key={diagram.id}>
          <div className="arch-head">
            <h2>{diagram.title}</h2>
            <a
              className="btn btn-ghost arch-open"
              href={diagram.file}
              target="_blank"
              rel="noreferrer"
            >
              単体で開く ↗
            </a>
          </div>
          <p className="arch-lead">{diagram.lead}</p>
          <div className="arch-frame">
            <iframe
              src={diagram.file}
              title={diagram.title}
              loading="lazy"
            />
          </div>
        </section>
      ))}
    </main>
  )
}