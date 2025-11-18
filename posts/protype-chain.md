---
title: '原型与原型链/Prototype and Prototype Chain'
date: '2025-11-18'
description: '深入解析 JavaScript 中的原型与原型链机制。理解对象如何通过原型继承属性和方法，掌握原型链的工作原理，以及如何利用原型进行高效的代码复用。'
keywords: 'JavaScript, 原型, 原型链, 继承, 对象, prototype, __proto__'
---
### 什么是原型（Prototype）？
在 JavaScript 中，每个对象都有一个`[[Prototype]]`内部属性（通过`__proto__`访问），它指向另一个对象，这个对象就是该对象的原型。通过原型，对象可以继承原型对象上的属性和方法。

```javascript
function Person() {}
const p = new Person();

console.log(p.__proto__ === Person.prototype); // true
```
当然你也可以用class重写：
```javascript
class Person {}
const p = new Person();
console.log(p.__proto__ === Person.prototype); // true
```

### 什么是原型链（Prototype Chain）？
原型链是由多个对象通过`[[Prototype]]`属性连接起来的链式结构。当访问一个对象的属性时，如果该属性不存在于对象本身，JavaScript 引擎会沿着原型链向上查找，直到找到该属性或到达原型链的顶端（即`null`）。
示意图：



### 为什么要有原型链


---
参考：
- [MDN Web Docs - 继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [MDN `Object.prototype.__proto__`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/proto?utm_source=chatgpt.com)