---
title: 'JS-Aagin-03 函数'
date: '2026-05-09'
description: ''
keywords: ''
---

函数是 JavaScript 编程中最核心的工具之一。将一段程序封装在一个值中的概念用途广泛。它使我们能够构建更复杂的程序结构，减少重复代码，将变量与子程序关联起来，并将这些子程序彼此隔离。

## 绑定和作用域
每个绑定都有一个作用域 ，即绑定在程序中可见的范围。对于定义在任何函数、代码块或模块之外的绑定（参见第 10 章 ），其作用域是整个程序——你可以在任何地方引用这些绑定。这些绑定被称为全局绑定 。

为函数参数创建的绑定或在函数内部声明的绑定只能在该函数内部引用，因此被称为局部绑定。每次调用函数时，都会创建这些绑定的新实例。这在函数之间提供了一定的隔离——每个函数调用都在其自身的小世界（局部环境）中运行，通常无需了解全局环境的运行情况即可理解其含义。

使用 let 和 const 声明的绑定实际上仅限于声明它们的代码块 ，因此，如果在循环内部创建了这类绑定，循环前后的代码都无法“看到”它。在 2015 年之前的 JavaScript 版本中，只有函数才会创建新的作用域，因此使用 var 关键字创建的旧式绑定在其所在的整个函数中都可见——如果它们不在函数中，则在整个全局作用域中都可见。

```js
let x = 10;   // global
if (true) {
  let y = 20; // local to block
  var z = 30; // also global
}
```

每个作用域都可以“查看”其周围的作用域，因此在示例中， x 在代码块内部是可见的。例外情况是当多个绑定具有相同的名称时——在这种情况下，代码只能看到最内层的绑定。例如，当 halve 函数内部的代码引用 n 时，它看到的是它自己的 n ，而不是全局的 n 。

```js
const halve = function(n) {
  return n / 2;
};

let n = 10;
console.log(halve(100));
// → 50
console.log(n);
// → 10
```

### 嵌套作用域
JavaScript 不仅区分全局绑定和局部绑定，它还允许在其他代码块和函数内部创建代码块和函数，从而产生多层次的局部性。

例如，这个函数（输出制作一批鹰嘴豆泥所需的配料）内部还包含另一个函数：

```js
const hummus = function(factor) {
  const ingredient = function(amount, unit, name) {
    let ingredientAmount = amount * factor;
    if (ingredientAmount > 1) {
      unit += "s";
    }
    console.log(`${ingredientAmount} ${unit} ${name}`);
  };
  ingredient(1, "can", "chickpeas");
  ingredient(0.25, "cup", "tahini");
  ingredient(0.25, "cup", "lemon juice");
  ingredient(1, "clove", "garlic");
  ingredient(2, "tablespoon", "olive oil");
  ingredient(0.5, "teaspoon", "cumin");
};
```

ingredient 函数内部的代码可以看到来自外部函数的 factor 绑定，但是它的局部绑定（例如 unit 或 ingredientAmount ）在外部函数中是不可见的。

代码块内可见的绑定集合取决于该代码块在程序文本中的位置。每个局部作用域都可以看到包含它的所有局部作用域，而所有作用域都可以看到全局作用域。这种绑定可见性机制称为词法作用域 。

64N：嵌套作用域是闭包的基础，但不等于闭包；当内层函数保留并使用外层作用域中的变量时，才体现为闭包。

## 函数作为值
