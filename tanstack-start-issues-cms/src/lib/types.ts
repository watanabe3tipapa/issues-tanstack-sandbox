export interface GitHubLabel {
  name: string
}

export interface GitHubUser {
  login: string
}

export interface GitHubIssue {
  number: number
  title: string
  body: string | null
  html_url: string
  state: 'open' | 'closed'
  created_at: string
  updated_at: string
  labels: GitHubLabel[]
  user: GitHubUser | null
}

export interface Post {
  slug: string
  number: number
  title: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  excerpt: string
  body: string
  githubUrl: string
  author: string
}