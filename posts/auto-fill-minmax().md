---
title: '卡片列表-流式列宽'
date: '2026-06-08'
description: '介绍 CSS Grid 中 auto-fill、auto-fit 与 minmax() 的区别，说明如何用流式列宽实现更自然的响应式卡片列表布局。'
keywords: 'CSS Grid, auto-fill, auto-fit, minmax, 响应式布局, 卡片列表, 流式列宽, grid-template-columns, TailwindCSS'
---

## 问题背景与核心思路

>[!question] 卡片应该固定宽度，还是跟随容器自动伸缩？

如果卡片宽度完全固定，页面在某些宽度下会出现右侧空白过大，也就是宽度不够再放下一列时；
如果用 `justify-content: space-between` 强行分摊空白，如果卡片数量少，卡片之间的间距又会被拉得很夸张。

更自然的做法是：

```css
grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
gap: 20px;
```

它的核心概念是：

- 每列最小宽度是 `240px`
- 容器够宽时，自动多放一列
- 放不下新列时，当前列用 `1fr` 平均吃掉剩余空间
- `gap` 始终保持固定，不会被撑大

也就是说，列宽不是固定死的，而是在“最小宽度”和“可用空间”之间自动伸缩。

---

## 固定列宽：右侧容易空出一大块

第一种常见写法是固定每列宽度：

```css
grid-template-columns: repeat(auto-fill, 280px);
justify-content: start;
gap: 20px;
```

这种方式很直观：每张卡片都是 `280px`，间距固定，左对齐。

但问题是，当容器宽度“差一点就能放下下一列”时，右侧会留下明显空白。

下面的演示为了适配博客正文的 `544px` 内容宽度，把演示卡片宽度缩小为 `128px`：

<div style="border:1px solid #ddd; padding:12px; border-radius:8px; margin:16px 0; box-sizing:border-box;">
  <p style="margin:0 0 12px; font-weight:600;">固定列宽：repeat(auto-fill, 128px)</p>
  <div style="
    display:grid;
    grid-template-columns:repeat(auto-fill, 128px);
    gap:16px;
    justify-content:start;
    background:#f7f7f8;
    padding:12px;
    box-sizing:border-box;
  ">
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 01</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 02</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 03</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 04</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 05</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 06</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 07</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 08</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 09</div>
  </div>
</div>

这种布局的优点是稳定，缺点是弹性不足。卡片不会变宽，所以剩余空间只能堆在右侧。

---

## 固定列宽 + `space-between`：间距可能被拉得很大

为了消除右侧空白，可以使用：

```css
grid-template-columns: repeat(auto-fit, 280px);
justify-content: space-between;
gap: 20px;
```

它似乎解决了右侧空白问题，但实际上是把空白分摊到了卡片之间。

当一行卡片数量不多时，卡片间距会变得非常大，视觉上容易显得松散。

<div style="border:1px solid #ddd; padding:12px; border-radius:8px; margin:16px 0; box-sizing:border-box;">
  <p style="margin:0 0 12px; font-weight:600;">固定列宽 + space-between</p>
  <div style="
    display:grid;
    grid-template-columns:repeat(auto-fit, 128px);
    gap:16px;
    justify-content:space-between;
    background:#f7f7f8;
    padding:12px;
    box-sizing:border-box;
  ">
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 1</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 2</div>
  </div>
</div>

这种方式的问题不是“不能用”，而是不适合卡片列表场景。

用户浏览项目页时，更希望卡片之间的节奏是稳定的，而不是随着容器宽度突然变得很松。

---

## 流式列宽：`auto-fill + minmax()`

更推荐的写法是：

```css
grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
gap: 20px;
```

它的行为更接近理想的项目列表：

- 先保证每列至少 `240px`
- 能多放一列就多放一列
- 不能多放时，让现有列稍微变宽，也就是 fraction，`1fr` 代表可用剩余空间的一份
- 卡片间距仍然固定为 `20px`

下面的演示同样使用适合正文宽度的 `128px` 作为最小列宽：

<div style="border:1px solid #ddd; padding:12px; border-radius:8px; margin:16px 0; box-sizing:border-box;">
  <p style="margin:0 0 12px; font-weight:600;">流式列宽：repeat(auto-fill, minmax(128px, 1fr))</p>
  <div style="
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(128px, 1fr));
    gap:16px;
    background:#f7f7f8;
    padding:12px;
    box-sizing:border-box;
  ">
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 01</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 02</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 03</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 04</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 05</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 06</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 07</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 08</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 09</div>
  </div>
</div>

这就是它和固定列宽最大的区别：

固定列宽会把剩余空间留在右侧；  
流式列宽会把剩余空间分配给当前行的列宽。

最终效果会更均匀，也更适合响应式页面。

---

## `auto-fill` 和 `auto-fit` 有什么区别？

`auto-fill` 和 `auto-fit` 很像，但在卡片数量较少时差异明显。

### `auto-fill`：保留空列

```css
grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
```

`auto-fill` 会保留“空槽位”。

也就是说，即使当前只有两个卡片，网格仍然会按照容器宽度计算出后面还能容纳的列。这样卡片不会被无限拉宽，更像是仍然处在一个完整的卡片库网格中。

<div style="border:1px solid #ddd; padding:12px; border-radius:8px; margin:16px 0; box-sizing:border-box;">
  <p style="margin:0 0 12px; font-weight:600;">auto-fill：少量卡片不会被拉得过大</p>
  <div style="
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(128px, 1fr));
    gap:16px;
    background:#f7f7f8;
    padding:12px;
    box-sizing:border-box;
  ">
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 1</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 2</div>
  </div>
</div>

### `auto-fit`：折叠空列

```css
grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
```

`auto-fit` 会把空列折叠掉。

如果只有两个卡片，剩余空间会被这两个卡片吃掉，它们可能会变得很宽。

<div style="border:1px solid #ddd; padding:12px; border-radius:8px; margin:16px 0; box-sizing:border-box;">
  <p style="margin:0 0 12px; font-weight:600;">auto-fit：空列被折叠，少量卡片会变宽</p>
  <div style="
    display:grid;
    grid-template-columns:repeat(auto-fit, minmax(128px, 1fr));
    gap:16px;
    background:#f7f7f8;
    padding:12px;
    box-sizing:border-box;
  ">
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 1</div>
    <div style="height:72px; background:#fff; border:1px solid #ccc; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:13px;">Card 2</div>
  </div>
</div>

`auto-fill` 保留了列表感，不会因为数据少就把卡片拉成大块。

---

## TailwindCSS 怎么写？

`auto-fill` 和 `auto-fit` 不是 TailwindCSS 的概念，而是 CSS Grid 的原生语法。

在 TailwindCSS 中，可以通过任意值写法使用：

```html
<div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
  ...
</div>
```

如果是 `auto-fit`：

```html
<div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
  ...
</div>
```

其中：

- `grid` 对应 `display: grid`
- `gap-5` 通常对应 `gap: 20px`
- `grid-cols-[...]` 是 Tailwind 的任意值语法
- `auto-fill` / `auto-fit` / `minmax()` 仍然是 CSS Grid 原生能力

如果项目里大量复用这类布局，也可以封装成组件或配置成语义化 class，避免每次写一长串。

---

## 推荐结论

对于项目页、素材库、模板库这类卡片列表，推荐使用：

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}
```

如果用 TailwindCSS：

```html
<div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
  ...
</div>
```

它解决的是几个关键问题：

- 左对齐
- 间距稳定
- 尽量填满行宽
- 容器变宽时自动增加列数
- 放不下新列时，当前列自然变宽
- 少量卡片时不会被拉得过大

简单说：

>[!note]
>固定列宽适合严格尺寸控制；  
>`auto-fill + minmax()` 更适合响应式卡片库。

