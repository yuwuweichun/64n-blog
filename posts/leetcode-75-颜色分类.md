### 题解
---
title: 'leetcode-75-颜色分类'
date: '2026-5-8'
description: 'leetcode'
keywords: '指针 数组结构赋值'
---

```ts
/*
 * @lc app=leetcode.cn id=75 lang=typescript
 *
 * [75] 颜色分类
 */


// 示例 1：
// 输入：nums = [2,0,2,1,1,0]
// 输出：[0,0,1,1,2,2]
// 示例 2：
// 输入：nums = [2,0,1]
// 输出：[0,1,2]
// -> 原地排序 0 1 2

/**
 * 很像快速排序里的 partition 分区策略
 * 小于 pivot 的放左边
 * 大于 pivot 的放右边
 */

// @lc code=start
/**
 Do not return anything, modify nums in-place instead.
 */
function sortColors(nums: number[]): void {
    let left = 0; // 下一个 0 的存放位置
    let right = nums.length-1; // 下一个 2 的存放位置
    let i = 0; // 当前检查的位置

    while(i<=right){
        if(nums[i]===0){
            [nums[i], nums[left]]=[nums[left], nums[i]]; //
            left++;
            i++;
        }else if(nums[i]===2){ // 为什么nums[i]===2时，i不用++？-> 交换后 i 不要立刻加一，因为从右边换过来的数还没检查过
            [nums[i],nums[right]]=[nums[right], nums[i]];
            right--
        }else{ // nums[i===1] 不做交换处理
            i++;
        }
    }
};
// @lc code=end
```

### 数据解构赋值
这里的交换：

```ts
[nums[i], nums[left]] = [nums[left], nums[i]];
```

用的是 **数组解构赋值**。

它的意思是：右边先组成一个临时数组，然后按位置赋值给左边。

比如：

```ts
let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a); // 2
console.log(b); // 1
```

等价于传统写法：

```ts
let temp = a;
a = b;
b = temp;
```

在这道题里：

```ts
[nums[i], nums[left]] = [nums[left], nums[i]];
```

等价于：

```ts
let temp = nums[i];
nums[i] = nums[left];
nums[left] = temp;
```

解构也可以用来取数组里的值：

```ts
const arr = [10, 20, 30];

const [first, second] = arr;

console.log(first);  // 10
console.log(second); // 20
```

还可以跳过某个位置：

```ts
const arr = [10, 20, 30];

const [first, , third] = arr;

console.log(first); // 10
console.log(third); // 30
```

对象也有解构：

```ts
const user = {
    name: "Tom",
    age: 18,
    city: "Shanghai"
};

const { name, city } = user;

console.log(name); // "Tom"
console.log(city); // "Shanghai"

```

数组解构看的是**位置**，对象解构看的是**属性名**。

用数组解构来交换两个位置的元素，写起来比 `temp` 简洁很多。

---
参考题解:
- https://leetcode.cn/problems/sort-colors/solutions/1868577/by-ac_oier-7lwk