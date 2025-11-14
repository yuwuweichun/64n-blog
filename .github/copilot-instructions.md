# AI Agent Project Instructions (Next.js Blog)

> 目的：帮助 AI 编码代理在本仓库（Next.js 静态博客，pages 路由）中快速定位结构、扩展 Markdown、引入样式模式，并避免与当前实现不符的假设。

## 架构概览
- 技术栈：Next.js (pages 目录), React 18+, Node >=18 (见 `package.json` engines)。
- 内容来源：`posts/*.md`，使用 `gray-matter` 提取 frontmatter (`title`, `date`)，再用 `remark + remark-gfm + remark-html` 转换为 HTML；渲染时通过 `dangerouslySetInnerHTML` 注入。
- 数据流：
  - 列表页 (`pages/index.js`)：`getStaticProps()` 调用 `getSortedPostsData()`（读取目录 + 解析 frontmatter + 按 `date` 倒序）。
  - 详情页 (`pages/posts/[id].js`)：`getStaticPaths()` 生成所有 id；`getStaticProps()` 中 `await getPostData(id)`（解析 + remark 转换）。
  - 日期展示：`components/date.js` 用 `date-fns` 格式化，格式字符串 `'LLLL d, yyyy'`。
- 布局：`components/layout.js` 提供头部（头像 + 名称）与返回链接；通过 `home` prop 控制头部大小与返回按钮。SEO/OG 元信息集中在此组件。 

## 关键文件与职责
- `lib/posts.js`：文件系统读取、frontmatter 解析、Markdown 转 HTML（已启用 GFM 支持）。新增 Markdown 功能需在这里链式 `.use(...)`。
- `pages/index.js`：首页文章列表；示例模式：`map` 渲染 `<Link href={/posts/${id}}>` + 日期组件。
- `pages/posts/[id].js`：文章页面；保持 `dangerouslySetInnerHTML` 的安全前提：仅来自受控 Markdown 文件。
- `components/layout.js`：统一 meta + 头像 + 结构；添加全局脚本或样式钩子优先放这里。
- `styles/*.module.css`：当前样式主要依赖 CSS Modules，而非 Tailwind 类。

## Markdown 扩展实践示例
在 `getPostData` 中追加插件示例：
```js
const processedContent = await remark()
  .use(remarkGfm)
  .use(html) // 保持现有
  // .use(customPlugin) // 新增时放这里
  .process(matterResult.content);
```
Frontmatter 示例（见 `posts/constructor-instance-prototype.md`）：
```md
---
title: '示例标题'
date: '2025-11-14'
---
```
日期必须可被 `parseISO` 成功解析（推荐 `YYYY-MM-DD`）。

## 内容新增流程
1. 新建 `posts/your-post.md`，包含合法 frontmatter。 
2. 运行 `npm run dev` 后自动被首页索引（无需手动登记）。
3. 排序依据：`date` 值字符串比较（当前逻辑：较新的在前）。如需精确排序/时区扩展，可改为 `new Date(a.date) - new Date(b.date)`。

## 构建与运行
- 开发：`npm run dev`（Next.js 内置 HMR）。
- 构建：`npm run build`；启动：`npm start`。
- 清理缓存：`npm run clean`（Windows 下删除 `.next` 目录）。

## 样式与 Tailwind 状态
- 已配置 `tailwind.config.js` 与 PostCSS，但 `global.css` 中尚未加入 `@tailwind base; @tailwind components; @tailwind utilities;` 指令，当前实际样式来源仍为 CSS Modules。
- 若需要启用 Tailwind：在 `global.css` 顶部添加上述三行，然后使用类名；注意与现有 `utils.module.css` 命名不冲突。

## UI 主题（Atom OneDark CLI 风格）
- 采用单一 CLI 主题，基于 Atom OneDark 配色方案。
- `components/UIFrame.js`：自动应用 `cli` class 到 body 元素。
- 配色体系（见 `styles/global.css` CSS 变量）：
  - **主文本**：`--cli-fg` (#abb2bf 浅灰)，`--cli-fg-bright` (#dcdfe4 明亮白色)
  - **状态色**：蓝 `--cli-blue` (函数/链接)、橙 `--cli-orange` (数字)、紫 `--cli-purple` (关键字)、绿 `--cli-green` (字符串)、红 `--cli-red` (错误)、青 `--cli-cyan` (常量)、黄 `--cli-yellow` (类名)
  - **背景**：`--cli-bg` (#282c34 深灰)、`--cli-bg-light` (#2c313a)
- 样式特点：等宽字体、简洁设计、无过度动效，符合 VSCode/Gemini CLI 美学。

## 安全与一致性注意点
- `dangerouslySetInnerHTML`：仅渲染受控 Markdown；不要引入用户提交内容而不做 Sanitization。
- ESM：`package.json` 设置 `"type": "module"`，保持 import 语法，不要退回 `require`。
- 新增依赖需与 Node >=18 兼容；避免引入需要额外构建配置的复杂工具（保持静态生成的简洁）。

## 已实现功能
- ✅ 代码高亮：`rehype-highlight` + Atom OneDark 配色
- ✅ Callouts 标注框：`remark-directive` + 自定义插件（`lib/remark-callouts.js`）
  - 语法：`:::note`、`:::warning`、`:::danger`、`:::success`
  - 颜色：蓝（note）、橙（warning）、红（danger）、绿（success）
- ✅ GFM 支持：表格、删除线、任务列表等（`remark-gfm`）

## 可扩展建议（基于现状，可直接落地）
- TOC 目录：在 `remark` 管线加入 `remark-toc`。
- RSS/站点地图：在 `getSortedPostsData` 结果基础上生成静态文件于 `public/`。
- 图像优化：Markdown 图片可迁移为 `<Image>` 组件（需解析阶段替换）。
- 数学公式：添加 `remark-math` + `rehype-katex`。

## 代理操作速查
- 添加文章：新建 Markdown + frontmatter → 保存 → 刷新。
- 调整排序：修改 `lib/posts.js` 排序逻辑。
- 扩展 Markdown：在 `getPostData` 中 `.use(...)` 插件链。
- 引入 Tailwind：更新 `global.css` + 使用类名。
- 修改配色：更新 `global.css` 中 `:root` 变量。
- 添加 Callout 类型：在 `lib/remark-callouts.js` 添加类型，并在 CSS 中定义对应样式。

> 如有未覆盖的流程（例如部署策略、CI）请反馈：可再补充“部署与发布”章节。