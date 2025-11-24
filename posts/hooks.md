---
title: '钩子/Hooks '
date: '2025-11-20'
description: 'React Hooks 详解，包括 useState、useEffect、useContext 等常用 Hooks 的使用方法和最佳实践。'
keywords: 'React, Hooks, useState, useEffect, useContext, 自定义 Hooks, 函数组件'
---
## 在了解hook之前
### 类组件与函数组件
React组件有两种写法：Class Component(类组件)与Function Component(函数组件+Hooks)
类组件的写法：
```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```
函数组件的写法：
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

联想到Vue中：
:::note
Vue中也有选项式与组合式两种组件写法，
:::


### 什么是副作用

## hook(钩子)的作用

---
参考：
- [阮一峰-轻松学会React钩子](https://www.ruanyifeng.com/blog/2020/09/react-hooks-useeffect-tutorial.html)