import { Link, notFound, createFileRoute } from '@tanstack/react-router'

import { MarkdownBody } from '../components/MarkdownBody'
import { getPostBySlug } from '../server/functions'

export const Route = createFileRoute('/posts/$slug')({
  head: () => ({
    meta: [
      {
        title: '記事 | TanStack Start + GitHub Issues CMS',
      },
    ],
  }),
  loader: async ({ params }) => {
    const post = await getPostBySlug({ data: params.slug })
    if (!post) throw notFound()
    return { post }
  },
  component: PostPage,
})

function PostPage() {
  const { post } = Route.useLoaderData()

  return (
    <main className="container page-post">
      <article>
        <header className="post-header">
          <div className="post-meta">
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            <span className="sep">·</span>
            <span>
              <a href={post.githubUrl} target="_blank" rel="noreferrer">
                issue #{post.number}
              </a>
            </span>
            {post.author ? (
              <>
                <span className="sep">·</span>
                <span>by {post.author}</span>
              </>
            ) : null}
          </div>
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="post-excerpt">{post.excerpt}</p> : null}
          {post.tags.length > 0 ? (
            <div className="post-tags">
              {post.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>
        <MarkdownBody content={post.body} />
        <footer className="post-footer">
          <Link to="/">← 記事一覧に戻る</Link>
          <a href={post.githubUrl} target="_blank" rel="noreferrer">
            GitHub の Issue で議論する →
          </a>
        </footer>
      </article>
    </main>
  )
}