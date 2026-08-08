---
title: "chapter-tgz: Random Access Inside Compressed Tar Archives"
status: published
review_status: reviewed
tags: [rust, compression, archives, performance]
source_url: "https://github.com/dtolnay/chapter-tgz"
source_platform: discord
source_server: "outcastgeektech"
source_channel: "ubuntutechhive"
source_author: "outcastgeek"
source_shared_at: "2026-08-04T01:24:12.900Z"
discord_message_id: "1534009028483747901"
---

# chapter-tgz: Random Access Inside Compressed Tar Archives

`chapter-tgz` is a Rust library for writing and reading specially structured `.tar.gz` files. It divides an archive into chapters so readers can skip groups of tar entries without decompressing all intervening data.

The repository documents two main benefits: a reader can reach predefined chapter boundaries in constant time, and different chapters can be decompressed concurrently. The format remains compatible with ordinary tar/gzip readers and writers. Chapter markers are encoded as valid empty gzip blocks with deliberately unusual Huffman alphabets, so archives without chapter metadata behave like a single chapter.

The examples show a writer creating chapters around large files and a reader selecting chapters for parallel processing. The idea is useful when a compressed archive needs ordinary compatibility but also needs faster access to known regions.

{{< source-link url="https://github.com/dtolnay/chapter-tgz" label="Read the original source" >}}

