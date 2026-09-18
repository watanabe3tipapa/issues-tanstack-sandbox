#!/usr/bin/env node
/**
 * 必要なラベル（status:published / status:draft）がリポジトリに存在するかを検証する
 * GitHub Actions の事前チェック用スクリプト。
 *
 * 使い方:
 *   GITHUB_OWNER=<owner> GITHUB_REPO=<repo> GITHUB_TOKEN=<token> npm run validate-labels
 *
 * 対象ラベルが 1 つでも不足している場合は exit code 1 で終了する。
 */

const REQUIRED_LABELS = new Set(['status:published', 'status:draft'])
const PER_PAGE = 100
const MAX_PAGES = 10

const owner = process.env.GITHUB_OWNER
const repo = process.env.GITHUB_REPO
const token = process.env.GITHUB_TOKEN

async function exitWithError(message) {
  console.error(`[validate-labels] ERROR: ${message}`)
  process.exit(1)
}

if (!owner || !repo) {
  await exitWithError(
    'GITHUB_OWNER / GITHUB_REPO が設定されていません。環境変数を指定してください。',
  )
}

console.log(`[validate-labels] labels を検証します: ${owner}/${repo}`)

const found = new Set()

for (let page = 1; page <= MAX_PAGES; page++) {
  const url = `https://api.github.com/repos/${owner}/${repo}/labels?per_page=${PER_PAGE}&page=${page}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: token ? `Bearer ${token}` : '',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (!res.ok) {
    await exitWithError(
      `GitHub API error (${res.status}): ${res.statusText} — ${url}`,
    )
  }

  const labels = await res.json()
  const batch = Array.isArray(labels) ? labels : []
  for (const label of batch) {
    found.add(label.name)
  }

  if (batch.length < PER_PAGE) break
}

const missing = [...REQUIRED_LABELS].filter((name) => !found.has(name))

if (missing.length > 0) {
  const list = missing.map((name) => `  - ${name}`).join('\n')
  await exitWithError(
    `以下のラベルがリポジトリにありません。作成してください。\n${list}`,
  )
}

console.log('[validate-labels] OK: 必要なラベルはすべて揃っています。')