---
title: "Stacked Pull Requests Are Now in Public Preview"
status: published
review_status: reviewed
tags: [git, github, code-review, collaboration]
source_url: "https://github.blog/changelog/2026-07-30-stacked-pull-requests-are-now-in-public-preview"
source_platform: discord
source_server: "outcastgeektech"
source_channel: "ubuntutechhive"
source_author: "outcastgeek"
source_shared_at: "2026-07-31T02:58:41.264Z"
discord_message_id: "1532583251863142440"
---

# Stacked Pull Requests Are Now in Public Preview

GitHub’s July 30, 2026 changelog describes stacked pull requests as an ordered series of small, focused pull requests. Each layer can be reviewed and checked independently, which lets a large change move forward without forcing reviewers to parse one oversized diff.

The workflow is available from github.com, the GitHub CLI, the mobile app, and a coding-agent skill. The changelog’s CLI starting point is `gh extension install github/gh-stack`. A stack can be merged as a whole or one layer at a time; existing branch protections, required checks, and review requirements still govern what reaches `main`. GitHub notes that public-preview rollout and merge-queue support are progressive rather than instantaneous.

{{< source-link url="https://github.blog/changelog/2026-07-30-stacked-pull-requests-are-now-in-public-preview" label="Read the original source" >}}

