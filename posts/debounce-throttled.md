---
title: "防抖节流"
date: "2025-11-24"
description: "防抖节流 头尾模式"
keywords: "防抖节流"
---
定时器写法
```javascript
function debounce(func, wait) { // 默认尾模式
    let timeout;
    return function(...args) { // 剩余参数
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait); // 箭头函数
    };
}

function throttled(func, delay) {
    let timer = null
    return function (...args) {
        if (!timer) {
            timer = setTimeout(() => {
                func.apply(this, args)
                timer = null
            }, delay);
        }
    }
}
```
通过 immediate 参数实现头/尾模式切换
```javascript
function debounce(func, wait, immediate) {

    let timeout;

    return function (...args) {
        if (timeout) clearTimeout(timeout); // timeout 不为null

        if (immediate) {
            let callNow = !timeout; // 第一次会立即执行，以后只有事件执行后才会再次触发
            timeout = setTimeout(() => {
                timeout = null;
            }, wait)
            if (callNow) {
                func.apply(this, args)
            }
        }
        else {
            timeout = setTimeout(() => {
                func.apply(this, args)
            }, wait);
        }
    }
}
```
使用单一 immediate(boolean) 只能表达两种状态：头触发或尾触发（二选一）。
要额外实现“头+尾触发”，需要两个彼此独立的控制位：leading 与 trailing（对象options）。

---
参考：
- [前端节流与防抖深度解析：从基础原理到工程实践-CSDN](https://blog.csdn.net/m0_66117560/article/details/154913519)