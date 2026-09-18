import matter from 'gray-matter'

import type { GitHubIssue, Post } from './types'

interface PostFrontmatter {
  slug?: unknown
  title?: unknown
  publishedAt?: unknown
  updatedAt?: unknown
  tags?: unknown
  excerpt?: unknown
  author?: unknown
}

function toDateString(value: unknown, fallback: string): string {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0] ?? fallback
  }
  if (typeof value === 'string' && value.trim()) {
    return value.split('T')[0] ?? fallback
  }
  if (typeof value === 'number') {
    return String(value)
  }
  return fallback
}

function toString(value: unknown, fallback: string): string {
  if (value === undefined || value === null) return fallback
  return String(value)
}

function toTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag)).filter(Boolean)
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/[,\s]+/)
      .map((tag) => tag.trim())
      .filter(Boolean)
  }
  return []
}

export function parseIssueToPost(issue: GitHubIssue): Post {
  const { data, content } = matter(issue.body ?? '')
  const fm = data as PostFrontmatter
  const created = issue.created_at.split('T')[0] ?? ''
  const updated = issue.updated_at.split('T')[0] ?? ''

  return {
    slug: toString(fm.slug, String(issue.number)),
    number: issue.number,
    title: toString(fm.title, issue.title),
    publishedAt: toDateString(fm.publishedAt, created),
    updatedAt: toDateString(fm.updatedAt, updated),
    tags: toTags(fm.tags),
    excerpt: toString(fm.excerpt, ''),
    body: content,
    githubUrl: issue.html_url,
    author: toString(fm.author, issue.user?.login ?? ''),
  }
}