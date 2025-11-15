---
title: '提升/Hoisting'
date: '2025-11-15'
---
## 提升(Hoisting)定义
在 JavaScript 中，变量声明和函数声明在代码执行前会被“提升”到当前作用域的顶部。
但注意：只有“声明”被提升，不是“赋值”。

也就是说 —— 你可以在声明之前使用它们（但结果不一定正确）。
## 变量提升
### var —— 声明提升，值为 undefined
```javascript
console.log(a); // 输出: undefined
var a = 5;
console.log(a); // 输出: 5
```
大多数静态类型语言（如 C、C++、Java、C# 等）不存在变量提升，要求变量在使用前必须先声明，否则会报编译错误。
```c++
#include <iostream>
using namespace std;

int main() {
    // cout << x << endl; // 编译错误：'x' was not declared in this scope
    int x = 5;
    cout << x << endl;   // 输出: 5
    return 0;
}
```
### let 和 const —— 声明提升，但不可访问（暂时性死区）
let 和 const 也会被提升，但会处在 Temporal Dead Zone（暂时性死区） 中，在执行到声明之前不能访问。
```javascript
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 10;
```
## 函数提升
### 函数声明 —— 完全提升
可以在声明前调用：
```javascript
foo(); // 输出: "hello"（函数声明被提升）
function foo() {
    console.log("hello");
}
```
### 函数表达式 —— 不会提升为函数，值为 undefined
如果用 `var` ，声明提升成 `var foo`，但赋值（函数体）不会提升，所以调用时 `foo === undefined`
```javascript
foo(); // TypeError: foo is not a function
var foo = function() {
    console.log("hello");
};
```
如果用 `let` 或 `const` 
```javascript
foo(); // ReferenceError: Cannot access 'foo' before initialization
let foo = function() {
    console.log("hello");
};
```
### 箭头函数 —— 不会提升为函数，值为 undefined
和函数表达式一样：
```javascript
foo(); // TypeError: foo is not a function
var foo = () => {
    console.log("hello");
};
```
如果用 `let` 或 `const` 
```javascript
foo(); // ReferenceError: Cannot access 'foo' before initialization
const foo = () => {
    console.log("hello");
};
```
## 为什么会有 hoisting
提升机制使得 JavaScript 引擎在执行代码前就能知道所有变量和函数的声明，从而简化了作用域链的构建过程。这种设计使得函数和变量可以在代码中更灵活地使用，但也可能导致一些意想不到的行为，因此理解提升机制对于编写正确的 JavaScript 代码非常重要。

---
参考：
- [MDN - Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)


