---
title: 'leetcode-1-两数之和'
date: '2025-11-16'
description: 'leetcode 第一题：两数之和。提供暴力双重循环解法、Set 解法和 Map 解法的 JavaScript 实现。'
keywords: ''
---
## 1.两数之和
### 题目描述
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。

你可以按任意顺序返回答案。
### 暴力双重循环解法
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
### Set 解法
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
### Map 解法
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
---
参考：
[Hello算法-hash](https://www.hello-algo.com/chapter_hashing/hash_map/)
mdn set
mdn map
