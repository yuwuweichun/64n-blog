---
title: 'leetcode-49-字母异位词分组'
date: '2025-11-16'
description: 'leetcode 第49题：字母异位词分组。提供排序法和计数法的 JavaScript 实现。'
keywords: '字母异位词, anagram, 分组, 哈希表, 排序法, 计数法, JavaScript, LeetCode, group anagrams'
---

## 题目描述

给定一个字符串数组，请你将**字母异位词**组合在一起。可以按任意顺序返回结果列表。

**字母异位词**是由重新排列源单词的所有字母得到的一个新单词。

**示例 1：**
```
输入：strs = ["eat","tea","tan","ate","nat","bat"]
输出：[["bat"],["nat","tan"],["ate","eat","tea"]]
```

**示例 2：**
```
输入：strs = [""]
输出：[[""]]
```

**示例 3：**
```
输入：strs = ["a"]
输出：[["a"]]
```

## 问题分析

### 核心问题：如何判断两个字符串是字母异位词？

**字母异位词的特征：**
- 字母种类完全相同
- 每个字母出现的次数完全相同
- 只是字母的顺序不同

例如：`"eat"`、`"tea"`、`"ate"` 都是异位词，因为它们都由 1 个 'e'、1 个 'a'、1 个 't' 组成。

### 解决思路

从异位词的特征出发，有两种主流方法：

1. **排序法**：将每个字符串的字母排序后作为「特征码」，排序结果相同的字符串必然是异位词
2. **计数法**：统计每个字符串中每个字母的出现次数，生成「字母频次指纹」，指纹相同的字符串是异位词

### 数据结构选择

使用 **Map（哈希表）** 来存储分组结果：
- **键（Key）**：字符串的特征码（排序结果或字母计数）
- **值（Value）**：具有相同特征码的字符串数组（即异位词组）

## 方法一：排序法排序法

**核心思路：**

将每个字符串的字符进行排序，排序后的字符串作为 Map 的键。异位词排序后必然得到相同的字符串。

**步骤：**
1. 遍历字符串数组
2. 对每个字符串进行排序：`str.split('').sort().join('')`
   - `split('')`：将字符串拆分成字符数组
   - `sort()`：对字符数组按字典序排序
   - `join('')`：将排序后的数组拼接回字符串
3. 使用排序后的字符串作为 Map 的键，将原字符串加入对应的数组
4. 返回 Map 中所有的值（即所有分组）

**示例演示：**
```
"eat"  -> split -> ['e','a','t'] -> sort -> ['a','e','t'] -> join -> "aet"
"tea"  -> split -> ['t','e','a'] -> sort -> ['a','e','t'] -> join -> "aet"
"tan"  -> split -> ['t','a','n'] -> sort -> ['a','n','t'] -> join -> "ant"
```

`"eat"` 和 `"tea"` 的键都是 `"aet"`，因此它们会被分到同一组。

```javascript
/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    const map = new Map();
    for (const str of strs) {
        const key = str.split('').sort().join('');
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(str);
    }
    return Array.from(map.values());
};
```

**复杂度分析：**
- **时间复杂度**：O(n × k log k)
  - n 是字符串数组的长度
  - k 是字符串的最大长度
  - 每个字符串需要排序，排序的时间复杂度为 O(k log k)
- **空间复杂度**：O(n × k)
  - Map 中存储所有字符串，需要 O(n × k) 空间

**优缺点：**
- ✅ 代码简洁，易于理解
- ✅ 实现直观，不易出错
- ❌ 排序操作相对耗时
- ❌ 对于较长的字符串，性能不如计数法

## 方法二：计数法（推荐）计数法（推荐）

**核心思路：**

统计每个字符串中每个字母的出现次数，生成一个「字母频次数组」作为特征码。由于题目只涉及小写字母，可以用长度为 26 的数组表示 26 个字母的出现次数。

**步骤：**
1. 创建长度为 26 的计数数组 `count`，初始值全为 0
2. 遍历字符串的每个字符，统计每个字母的出现次数
   - 通过 `charCodeAt(0) - 'a'.charCodeAt(0)` 计算字母在数组中的索引
   - 例如：'a' -> 0, 'b' -> 1, ..., 'z' -> 25
3. 将计数数组转换为字符串作为 Map 的键：`count.join('#')`
4. 将原字符串加入对应的分组
5. 返回所有分组

**示例演示：**

以 `"eat"` 为例：
```
遍历 'e': count[4]++ -> [0,0,0,0,1,0,...,0]
遍历 'a': count[0]++ -> [1,0,0,0,1,0,...,0]
遍历 't': count[19]++ -> [1,0,0,0,1,0,...,0,1,0,...,0]

转换为键: "1#0#0#0#1#0#0#0#0#0#0#0#0#0#0#0#0#0#0#1#0#0#0#0#0#0"
           ↑       ↑                             ↑
           a       e                             t
```

`"eat"`、`"tea"`、`"ate"` 都会生成相同的计数数组，因此会被分到同一组。

**为什么使用 `#` 作为分隔符？**

:::note
使用分隔符可以避免歧义。例如：
- `[1, 2]` 和 `[12]` 如果直接 `join('')` 都会得到 `"12"`
- 使用 `join('#')` 后分别得到 `"1#2"` 和 `"12"`，避免了冲突
:::

```javascript
/**
 * @param {string[]} strs
 * @return {string[][]}
 */ 
var groupAnagrams = function(strs) {
    const map = new Map();
    for (const str of strs) {
        const count = new Array(26).fill(0);
        for (const char of str) {
            count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }
        const key = count.join('#'); // 使用'#'作为分隔符
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(str);
    }
    return Array.from(map.values());
};
```

**复杂度分析：**
- **时间复杂度**：O(n × k)
  - n 是字符串数组的长度
  - k 是字符串的最大长度
  - 每个字符串需要遍历一次来统计字母频次
- **空间复杂度**：O(n × k)
  - Map 中存储所有字符串和计数数组的字符串表示

**优缺点：**
- ✅ 时间复杂度更优，避免了排序的 O(k log k) 开销
- ✅ 适合处理较长的字符串
- ⚠️ 代码相对复杂一些
- ⚠️ 只适用于固定字符集（如只有小写字母）

## 方法对比与总结

| 方法 | 时间复杂度 | 空间复杂度 | 适用场景 | 推荐度 |
|------|-----------|-----------|---------|--------|
| 排序法 | O(n × k log k) | O(n × k) | 字符串较短 | ⭐⭐⭐⭐ |
| **计数法** | **O(n × k)** | **O(n × k)** | **字符串较长、字符集固定** | **⭐⭐⭐⭐⭐** |

**选择建议：**

- **字符串较短（k < 100）**：两种方法性能差异不大，排序法代码更简洁
- **字符串较长（k > 100）**：计数法性能更优，推荐使用
- **面试场景**：两种方法都应该掌握，并能分析各自的优缺点

## 关键点与技巧

1. **哈希表的应用**：使用 Map 进行分组，键为特征码，值为分组数组
2. **特征码的选择**：
   - 排序法：排序后的字符串（简单直观）
   - 计数法：字母频次数组（性能更优）
3. **字符索引计算**：`charCodeAt(0) - 'a'.charCodeAt(0)` 将字符映射到 0-25
4. **避免键冲突**：计数法使用分隔符 `#` 避免不同计数数组生成相同的键

## 扩展思考

**Q: 如果字符串包含 Unicode 字符（如中文、emoji）怎么办？**

A: 排序法仍然适用，但计数法需要改用 Map 来统计字符频次，因为字符集不再是固定的 26 个字母。

```javascript
// 处理 Unicode 字符的计数法
const count = new Map();
for (const char of str) {
    count.set(char, (count.get(char) || 0) + 1);
}
const key = JSON.stringify([...count.entries()].sort());
```

**Q: 能否用数组替代 Map？**

A: 可以，但不推荐。使用对象或数组作为键需要序列化，而 Map 可以直接使用字符串作为键，性能更好。

---
参考：
- [LeetCode 官方题解](https://leetcode.cn/problems/group-anagrams/)
- [MDN - Map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN - Array.prototype.sort()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- [MDN - String.prototype.charCodeAt()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)
