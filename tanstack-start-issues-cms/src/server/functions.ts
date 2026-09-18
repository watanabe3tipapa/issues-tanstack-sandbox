import { createServerFn } from '@tanstack/react-start'

import { fetchPublishedIssues } from '../lib/github.server'
import { parseIssueToPost } from '../lib/issues'
import type { Post } from '../lib/types'

async function loadPosts(): Promise<Post[]> {
  const issues = await fetchPublishedIssues()
  return issues.map(parseIssueToPost)
}

export const getPosts = createServerFn({ method: 'GET' }).handler(loadPosts)

export const getPostBySlug = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const posts = await loadPosts()
    return posts.find((post) => post.slug === slug) ?? null
  })