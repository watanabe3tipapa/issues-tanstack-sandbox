import type { Post } from '../lib/types'
import { PostCard } from './PostCard'

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="empty">
        公開済みの記事はまだありません。GitHub リポジトリで{' '}
        <code>status:published</code> ラベル付き Issue を作成してください。
      </p>
    )
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}