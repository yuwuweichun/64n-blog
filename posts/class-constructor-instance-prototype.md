---
title: '类-构造函数-实例-原型之间的关系'
date: '2025-11-18'
description: '深入解析 JavaScript 中类、构造函数、实例和原型之间的关系。理解 ES6 类语法的本质，掌握原型链机制，以及类声明与函数构造器的异同。'
keywords: 'JavaScript, 类, 构造函数, 原型, 原型链, ES6, class, prototype'
---
**Q：类(class)-构造函数(constructor)-实例(instance)-原型(prototype)之间的关系**

A：js中类本质上是构造函数的语法糖，类定义的实例方法实际上是定义在构造函数的 prototype 对象上。实例对象是使用new关键字调用构造函数得到的，通过原型链访问类中定义的方法。

### 类（class）
类是用于创建对象的模板。它们用代码封装数据以对其进行处理。JS 中的类建立在原型之上，同时还具有一些类独有的语法和语义。

ES6 的 class 本质上是一个构造函数（function），也就是说：
```
class → constructor function 的语法糖
```
并且
```javascript
class A {}
console.log(typeof A); // "function"
```

class的"等价交换"
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  sayHi() {
    console.log("hi");
  }

  static createAnonymous() {
    return new Person("anonymous");
  }
}
// 等价于
function Person(name) {
  this.name = name;            // 等价于 constructor 部分
}

// 原型方法
Person.prototype.sayHi = function () {
  console.log("hi");
};

// 静态方法
Person.createAnonymous = function () {
  return new Person("anonymous");
};
```

就像你能够定义的函数表达式和函数声明一样，类也有两种定义方式：类声明和类表达式。

#### 类声明
```javascript
class MyClass {
  // 类主体……
}
```
在类体内，有若干特性可用
```javascript
class MyClass {
  // 构造函数
  constructor() {
    // 构造函数主体
  }
  // 实例字段
  myField = "foo";
  // 实例方法
  myMethod() {
    // myMethod 主体
  }
  // 静态字段
  static myStaticField = "bar";
  // 静态方法
  static myStaticMethod() {
    // myStaticMethod 主体
  }
  // 静态块
  static {
    // 静态初始化代码
  }
  // 字段、方法、静态字段、静态方法、静态块都可以使用“私有”形式
  #myPrivateField = "bar";
}
```

#### 类表达式
```javascript
const MyClass = class {
  // 类主体……
};
```

### 构造函数（constructor function）
---
参考：
- [MDN - 类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)
- [MDN - 使用类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_classes)
- [MDN - 构造函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes/constructor)

---
相关：
- []
