---
title: 'leetcode-1-两数之和'
date: '2025-11-16'
description: 'leetcode 第一题：两数之和。提供暴力双重循环解法、Set 解法和 Map 解法的 JavaScript 实现。'
keywords: '两数之和, two sum, 哈希表, 暴力法, Set, Map, JavaScript, LeetCode, 数组, 索引, 求和'
---

## 题目描述

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出**和为目标值 `target`** 的那**两个**整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。

**示例 1：**
```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9，返回 [0, 1]。
```

**示例 2：**
```
输入：nums = [3,2,4], target = 6
输出：[1,2]
```

**示例 3：**
```
输入：nums = [3,3], target = 6
输出：[0,1]
```

## 问题分析

这道题的核心是：**如何高效地判断数组中是否存在两个数的和等于目标值**。

关键思路：对于数组中的每个数 `nums[i]`，我们需要查找是否存在另一个数 `need = target - nums[i]`。

- **暴力法**：两层循环遍历所有可能的组合
- **优化法**：使用哈希表（Set/Map）将查找时间从 O(n) 降低到 O(1)

## 方法一：暴力双重循环解法环解法

**思路：**

使用两层嵌套循环遍历数组的所有可能组合，检查是否有两个数的和等于目标值。

- 外层循环遍历第一个数 `nums[i]`
- 内层循环从 `i+1` 开始遍历第二个数 `nums[j]`（避免重复使用同一元素）
- 如果 `nums[i] + nums[j] === target`，返回下标 `[i, j]`

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
};
```

**复杂度分析：**
- **时间复杂度**：O(n²)，两层嵌套循环
- **空间复杂度**：O(1)，只使用常量额外空间

**优缺点：**
- ✅ 实现简单直观
- ❌ 效率低，数据量大时性能差

## 方法二：Set 解法 解法

**思路：**

使用 Set 数据结构来存储已经遍历过的数字，实现 O(1) 的查找时间。

- 遍历数组，对于每个数 `nums[i]`，计算需要的另一个数 `need = target - nums[i]`
- 如果 `need` 已经在 Set 中，说明找到了答案
- 否则，将 `nums[i]` 加入 Set，继续遍历

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const set = new Set();
    for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (set.has(need)) {
            return [nums.indexOf(need), i];
        }
        set.add(nums[i]);
    }
    return [];
};
```

**复杂度分析：**
- **时间复杂度**：O(n²)，虽然只有一层循环，但 `indexOf` 方法需要 O(n) 时间
- **空间复杂度**：O(n)，Set 需要存储最多 n 个元素

**注意事项：**
:::warning
这个方法存在性能问题！虽然使用了 Set，但 `nums.indexOf(need)` 仍然需要 O(n) 时间去查找下标，导致整体时间复杂度仍为 O(n²)。**不推荐使用此方法**。
:::

## 方法三：Map 解法（推荐） 解法（推荐）

**思路：**

使用 Map（哈希表）存储**值到索引的映射**，实现真正的 O(1) 查找。

- 创建一个 Map，键为数组元素值，值为该元素的索引
- 遍历数组，对于每个数 `nums[i]`，计算需要的另一个数 `need = target - nums[i]`
- 如果 `need` 在 Map 中存在，直接返回 `[map.get(need), i]`
- 否则，将当前数及其索引存入 Map：`map.set(nums[i], i)`

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map(); // 值 -> 索引
    for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (map.has(need)) return [map.get(need), i];
        map.set(nums[i], i);
    }
    return [];
};
```

**复杂度分析：**
- **时间复杂度**：O(n)，只需遍历一次数组，Map 的查找和插入都是 O(1)
- **空间复杂度**：O(n)，Map 需要存储最多 n 个元素

**优缺点：**
- ✅ 时间效率最优，只需一次遍历
- ✅ 代码简洁清晰
- ✅ 同时存储了值和索引，避免二次查找
- ⚠️ 需要额外的空间存储 Map

**为什么 Map 比 Set 好？**

Map 存储的是 `值 -> 索引` 的映射，可以直接获取索引；而 Set 只存储值，找到匹配后还需要用 `indexOf` 去查找索引，导致额外的 O(n) 时间。

## 总结

| 方法 | 时间复杂度 | 空间复杂度 | 推荐度 |
|------|-----------|-----------|--------|
| 暴力双重循环 | O(n²) | O(1) | ⭐ |
| Set 解法 | O(n²) | O(n) | ⭐⭐ |
| **Map 解法** | **O(n)** | **O(n)** | **⭐⭐⭐⭐⭐** |

**最佳实践：** 使用 Map 解法，以空间换时间，实现最优的时间复杂度。

## 关键点

1. **哈希表的应用**：用空间换时间，将查找时间从 O(n) 降到 O(1)
2. **边遍历边存储**：不需要预先构建完整的哈希表，遍历过程中动态构建
3. **避免重复使用**：通过先查找后插入的顺序，自然避免了同一元素被使用两次

---

参考

- [LeetCode 官方题解](https://leetcode.cn/problems/two-sum/)
- [Hello算法 - 哈希表](https://www.hello-algo.com/chapter_hashing/hash_map/)
- [MDN - Set](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN - Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)
