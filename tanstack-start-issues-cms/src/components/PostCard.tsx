import { Link } from '@tanstack/react-router'

import type { Post } from '../lib/types'

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <div className="post-card-meta">
        <time dateTime={post.publishedAt}>{post.publishedAt}</time>
        <span className="sep">·</span>
        <span>#{post.number}</span>
      </div>
      <h2>
        <Link to="/posts/$slug" params={{ slug: post.slug }}>
          {post.title}
        </Link>
      </h2>
      {post.excerpt ? <p className="post-card-excerpt">{post.excerpt}</p> : null}
      {post.tags.length > 0 ? (
        <div className="post-card-tags">
          {post.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  )
}