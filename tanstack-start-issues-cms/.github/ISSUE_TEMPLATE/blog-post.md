---
name: ブログ記事
about: この Issue が記事として公開されます
title: "[記事] タイトルを入力"
labels: ["status:draft"]
---

> 記事の本文冒頭に YAML frontmatter を配置してください。
> `status:published` ラベルを付けると公開されます。

```md
---
slug: example-post
title: 記事タイトル
excerpt: 一覧に表示される要約
tags:
  - tanstack-start
  - github-issues
publishedAt: 2026-01-01
author: your-name
---

ここから記事本文を Markdown で書いてください。
```

<!--
ヒント:
- slug を省略すると Issue 番号が使われます。
- publishedAt を省略すると作成日が使われます。
- ラベル: status:draft は下書き、status:published は公開を示します。
-->