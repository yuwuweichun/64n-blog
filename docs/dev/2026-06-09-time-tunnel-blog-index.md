# 时间隧道博客索引开发文档

本文档记录将当前首页文章列表升级为 3D「时间隧道」博客索引的实现方案。

## 背景与目标

首页通过 `getSortedPostsData()` 获取文章数据。时间隧道只替换首页展示层，不修改 Markdown 解析和文章详情页。

```ts
type BlogTunnelPost = {
  id: string;
  title: string;
  date: string;
  description?: string;
};
```

目标：

- 使用 `three`、`@react-three/fiber`、`@react-three/drei` 构建桌面端时间隧道。
- 最新文章离相机最近，旧文章沿 Z 轴向后排列。
- 文章信息使用 HTML 卡片，保证文字清晰且链接可访问。
- 移动端、无 WebGL 和减少动态效果环境回退到传统列表。

## 组件设计

- `TimeTunnel`：检测视口、WebGL 和 `prefers-reduced-motion`，决定使用 3D 场景或列表。
- `BlogTunnelScene`：管理 Canvas、相机、轨道、节点和滚轮推进。
- `BlogTunnelCard`：使用 drei `<Html>` 展示日期、标题和摘要。
- `BlogListFallback`：保留传统文章链接列表，负责 SSR 和兼容降级。

首页使用：

```tsx
<TimeTunnel posts={allPostsData} />
```

3D 场景使用动态导入并关闭 SSR；`TimeTunnel` 本身保持 SSR 安全，以便服务端先输出文章列表。

## 交互规则

- 鼠标位于隧道区域时，滚轮只推进时间轴，不滚动页面。
- 使用原生 `wheel` 监听并设置 `{ passive: false }`，调用 `preventDefault()` 和 `stopPropagation()`。
- 容器使用 `overscroll-behavior: contain` 阻止滚动链传递。
- hover 或键盘聚焦卡片时，对应节点高亮。
- 点击卡片进入 `/posts/[id]`。

## 样式与兼容

- 延续当前 CLI / Atom OneDark CSS 变量。
- Canvas 桌面端高度使用 `clamp(520px, 70vh, 760px)`。
- 小于 `768px` 时显示传统列表。
- WebGL 不可用或开启 `prefers-reduced-motion: reduce` 时显示传统列表。
- Canvas 设置 `aria-hidden="true"`，可访问链接由 HTML 卡片和 fallback 提供。

## 验收标准

- `npm run build` 通过。
- 桌面端显示时间隧道，文章按日期倒序从近到远排列。
- 隧道区域内滚动不会带动页面。
- 卡片链接能进入对应文章详情页。
- 移动端、无 WebGL、减少动态效果模式显示传统列表。
- 服务端 HTML 仍包含真实文章链接。
