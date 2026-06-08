# Markdown 支持说明

本文档记录当前博客的 Markdown 解析链路、已支持语法，以及各类语法最终对应的渲染样式。代码入口主要在 `lib/posts.js`、`lib/remark-callouts.js` 和 `styles/global.css`。

## 处理链路

1. 文章存放在 `posts/*.md`。
2. `lib/posts.js` 使用 `gray-matter` 解析 frontmatter。
3. Markdown 内容交给 `remark` 处理，当前插件顺序是：
   - `remark-gfm`
   - `remark-directive`
   - `remarkCallouts`
   - `remark-rehype`
   - `rehype-raw`
   - `rehype-highlight`
   - `rehype-stringify`
4. `pages/posts/[id].js` 将生成的 HTML 通过 `dangerouslySetInnerHTML` 注入页面。
5. 全局样式由 `styles/global.css` 控制，主题基于 Atom OneDark 风格的 CLI 变量。

说明：
- `rehype-raw` 允许保留 Markdown 中的原始 HTML。
- 这套内容渲染链路默认面向仓库内受控文章，不是面向用户上传内容的通用富文本系统。

## Frontmatter

当前文章元数据字段：

```md
---
title: '文章标题'
date: '2026-06-08'
description: '可选摘要'
keywords: '可选关键词'
---
```

字段用途：
- `title`：文章标题
- `date`：列表页排序和详情页展示
- `description`：可选摘要
- `keywords`：可选关键词

## 已支持语法

### 基础 Markdown

当前可直接使用的常见语法包括：
- 标题 `#` 到 `######`
- 段落
- 强调和加粗
- 行内代码
- 代码块
- 链接
- 图片
- 无序列表、有序列表
- 引用块
- 分割线

### GFM 扩展

`remark-gfm` 已启用，支持：
- 表格
- 删除线
- 任务列表
- 自动链接
- 脚注

### 自定义 Callout

当前支持两种写法：

```md
:::note
内容
:::
```

```md
>[!note]
>
> 内容
```

可用类型：
- `note`
- `warning`
- `danger`
- `success`
- `tip`
- `question`

补充说明：
- `>[!type]` 这一类写法会在首行识别 callout 类型，后续每行继续保持在同一个 blockquote 中即可。

## 渲染样式

### Callout

Callout 会被转换成：

```html
<div class="callout callout-note">
  <div class="callout-title">Note</div>
  ...
</div>
```

通用样式：
- 内边距：`1rem 1.25rem`
- 外边距：`1.5rem 0`
- 圆角：`4px`
- 背景：`var(--cli-bg-light)`
- 边框：`1px solid var(--cli-border)`
- 左侧强调边：`3px`

颜色映射：
- `note` - 蓝色
- `warning` - 橙色
- `danger` - 红色
- `success` - 绿色
- `tip` - 紫色
- `question` - 青色

标题样式：
- 加粗
- 0.9rem 字号
- 左侧带 `▶` 标记
- 当 callout 只有标题时，标题底部间距会被清掉

### 普通引用块

未匹配 `[!type]` 的普通 `>` 引用块会保留为 `blockquote`：
- 左侧黄色边框
- 深色背景
- 斜体显示

### 表格

- `border-collapse: collapse`
- 表头为紫色文字
- 行 hover 时背景变深
- 单元格有统一内边距

### 标题

- `h1`：底部边框
- `h2`：黄色文字 + 底边框
- `h3`：蓝色文字
- `h4` 到 `h6`：继承统一标题排版

### 代码

- 行内代码：深色底 + 橙色文字
- 代码块：深色背景、边框、阴影
- 高亮：通过 `rehype-highlight` 和 `hljs-*` 样式控制
- 代码块滚动条也做了单独美化

### 列表、图片、分割线

- 列表标记使用青色
- 图片为块级显示，带边框和阴影
- 分割线使用细的边界色

## 代码位置

- `lib/posts.js`：读取文章、解析 frontmatter、组织 remark/rehype 流水线
- `lib/remark-callouts.js`：`:::type` 和 `>[!type]` 标注框转换
- `styles/global.css`：Markdown 全局排版与 callout 视觉样式
- `pages/posts/[id].js`：把 HTML 注入详情页

## 扩展方式

如果以后要加新的 Markdown 语法，通常按这个顺序改：

1. 先在 `lib/posts.js` 的 remark/rehype 链路里加解析插件。
2. 再在 `lib/remark-callouts.js` 或新的插件里做 AST 转换。
3. 最后在 `styles/global.css` 里补对应样式。

