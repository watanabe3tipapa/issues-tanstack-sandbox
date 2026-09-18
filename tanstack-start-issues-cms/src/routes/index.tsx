import { createFileRoute } from '@tanstack/react-router'

import { PostList } from '../components/PostList'
import { getPosts } from '../server/functions'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      {
        title: '記事一覧 | TanStack Start + GitHub Issues CMS',
      },
      {
        name: 'description',
        content: 'GitHub Issues を CMS として利用する TanStack Start の記事一覧',
      },
    ],
  }),
  loader: async () => {
    const posts = await getPosts()
    return { posts }
  },
  component: Home,
})

function Home() {
  const { posts } = Route.useLoaderData()

  return (
    <main className="container page-index">
      <section className="hero">
        <p className="eyebrow">GitHub Issues CMS</p>
        <h1>TanStack Start + GitHub Issues</h1>
        <p className="lead">
          GitHub Issues を CMS として利用し、Server Functions から取得した記事を表示する
          TanStack Start のサンドボックスです。
        </p>
        <div className="hero-status">
          <span className="tag published">status:published</span>
          <span className="hero-count">{posts.length} posts</span>
        </div>
      </section>
      <PostList posts={posts} />
    </main>
  )
}