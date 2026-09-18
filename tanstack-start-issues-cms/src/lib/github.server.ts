import type { GitHubIssue } from './types'

const API_VERSION = '2022-11-28'
const PUBLISHED_LABEL = 'status:published'
const PER_PAGE = 100
const MAX_PAGES = 10

export function getGitHubConfig() {
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const token = process.env.GITHUB_TOKEN

  if (!owner || !repo) {
    throw new Error(
      'GITHUB_OWNER / GITHUB_REPO environment variables are required. See .env.example',
    )
  }

  return { owner, repo, token }
}

export async function fetchPublishedIssues(): Promise<GitHubIssue[]> {
  const { owner, repo, token } = getGitHubConfig()

  const issues: GitHubIssue[] = []
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&labels=${PUBLISHED_LABEL}&sort=created&direction=desc&per_page=${PER_PAGE}&page=${page}`
    const res = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: token ? `Bearer ${token}` : '',
        'X-GitHub-Api-Version': API_VERSION,
      },
    })

    if (!res.ok) {
      const detail = (await res.json().catch(() => null)) as { message?: string } | null
      throw new Error(
        `GitHub API error (${res.status}): ${detail?.message ?? res.statusText} — fetching ${url}`,
      )
    }

    const batch = (await res.json()) as GitHubIssue[]
    issues.push(...batch)

    if (batch.length < PER_PAGE) break
    if (issues.length >= PER_PAGE * MAX_PAGES) break
  }

  return issues
}