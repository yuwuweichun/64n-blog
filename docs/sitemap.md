# Sitemap 自动生成流程

本文档记录当前博客系统中 sitemap 的生成方式，以及更新文章后 sitemap 如何随部署自动刷新。

## 当前结论

当前项目使用 `next-sitemap` 在构建阶段自动生成 sitemap。

只要文章更新后提交并推送到主分支，Vercel 会触发重新部署；部署过程中执行 `npm run build`，随后自动生成最新的 `public/sitemap.xml` 和 `public/robots.txt`。

因此，正常发布文章时不需要手动维护 sitemap 文件。

## 相关文件

- `package.json`：定义构建命令。
- `next-sitemap.config.cjs`：定义 sitemap 生成配置。
- `vercel.json`：指定 Vercel 使用 `npm run build` 作为构建命令。
- `posts/*.md`：文章数据来源。
- `.gitignore`：忽略自动生成的 sitemap 和 robots 文件。

## 构建命令

`package.json` 中的构建脚本如下：

```json
"build": "next build && next-sitemap --config next-sitemap.config.cjs"
```

这个命令分为两步：

1. `next build`：根据 `pages/` 和 `posts/*.md` 生成 Next.js 构建产物。
2. `next-sitemap --config next-sitemap.config.cjs`：读取构建结果并生成 sitemap 与 robots 文件。

## 部署时自动更新流程

当前推荐的文章发布流程是：

1. 在 `posts/` 目录中新增或修改 Markdown 文章。
2. 提交改动到 Git。
3. 推送到主分支。
4. Vercel 检测到推送后自动执行部署。
5. Vercel 根据 `vercel.json` 执行 `npm run build`。
6. `next build` 生成文章页面。
7. `next-sitemap` 自动生成最新的 sitemap。
8. 新部署上线后，线上 `/sitemap.xml` 会包含最新文章路由。

## sitemap 配置

配置文件是 `next-sitemap.config.cjs`。

当前主要配置包括：

- `siteUrl`：站点根地址，优先使用 `NEXT_PUBLIC_SITE_URL`，否则使用 `https://64n-blog.vercel.app`。
- `generateRobotsTxt: true`：同时生成 `robots.txt`。
- `generateIndexSitemap: false`：不生成 sitemap 索引文件，只生成单个 sitemap。
- `exclude`：排除 API 路由和旧的 sitemap 页面入口。
- `transform`：按路径类型设置 `changefreq`、`priority` 和 `lastmod`。

当前规则：

- 首页 `/`：
  - `changefreq: weekly`
  - `priority: 1.0`
- 文章页 `/posts/*`：
  - `changefreq: monthly`
  - `priority: 0.8`
- 其他页面：
  - `changefreq: monthly`
  - `priority: 0.7`

## 生成文件

构建后会生成：

```text
public/sitemap.xml
public/robots.txt
```

这些文件属于构建产物，不需要手动编辑。

`.gitignore` 中已经忽略它们：

```gitignore
public/sitemap*.xml
public/robots.txt
```

这表示本地构建产生的 sitemap 不需要提交到仓库。线上部署时，Vercel 会在构建产物中重新生成并发布它们。

## 更新文章后的行为

当新增、删除或修改 `posts/*.md` 后：

- 如果只是本地改动，线上 sitemap 不会变化。
- 如果提交并推送，Vercel 重新部署后，线上 sitemap 会自动更新。
- 如果本地执行 `npm run build`，本地 `public/sitemap.xml` 也会被重新生成，但该文件不会被 Git 跟踪。

## 当前限制

当前 `next-sitemap.config.cjs` 中的 `lastmod` 使用的是构建时间：

```js
lastmod: new Date().toISOString()
```

这意味着每次构建时，sitemap 中所有 URL 的 `lastmod` 都会变成同一个构建时间，而不是每篇文章真实的更新时间。

如果后续希望 sitemap 更精确，可以在文章 frontmatter 中增加 `updated` 字段，并让 sitemap 生成逻辑读取文章的 `updated` 或 `date` 作为 `lastmod`。

示例：

```md
---
title: 示例文章
date: 2026-06-01
updated: 2026-06-08
---
```

## 推荐维护方式

当前阶段建议继续使用部署时自动生成方案：

- 不提交 `public/sitemap.xml`。
- 不手动编辑 `public/robots.txt`。
- 每次更新文章后正常提交并推送。
- 让 Vercel 在部署阶段自动生成最新 sitemap。

如果后续文章数量增加，或者需要更准确的 SEO 更新信号，再考虑把 `lastmod` 改为读取文章 frontmatter。
