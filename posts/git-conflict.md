---
title: '合并冲突/Merge Conflict'
date: '2025-11-15'
description: '全面了解 Git 合并冲突的产生原因、解决方法和预防策略。通过实例演示如何处理同一文件同一行的修改冲突，以及冲突解决后的分支合并机制。'
keywords: 'Git, 合并冲突, Merge Conflict, 版本控制, 分支管理, Git 冲突解决'
---
## 合并冲突定义
Git 通常可以自动解决分支之间的冲突并合并它们。 通常，更改发生在不同的行，甚至不同的文件，因此计算机容易理解合并。 但是，有时存在竞争更改的情况：
- 同一文件的同一行被不同分支修改
- 一边修改文件内容，另一边删除了文件
- 文件结构变化冲突（重命名 + 修改）
- ...

这时候 Git 需要你帮助以确定最终合并中要加入哪些更改。
## 引发合并冲突
### 在 feature-a 分支修改
```shell
git checkout -b feature-a
# 然后修改文件的某一部分
git add posts/git-conflict.md
git commit -m "feature-a: 功能分支A的更改"
```
### 在 feature-b 分支修改同一位置
```shell
git checkout master
git checkout -b feature-b
# 修改文件的同一部分（造成冲突）
git add posts/git-conflict.md
git commit -m "feature-b: 功能分支B的更改"
```
### 合并 feature-a
```shell
git checkout master
git merge feature-a
```
### 合并 feature-b（产生冲突！）
```shell
git merge feature-b
# 这时会出现冲突，需要手动解决
```
错误信息如下
```shell
Auto-merging posts/git-conflict.md
CONFLICT (content): Merge conflict in posts/git-conflict.md
Automatic merge failed; fix conflicts and then commit the result.
```

## 解决冲突之后
当feature-a分支和feature-b分支第一次各自在同一个文件的第17行做了更改，产生了合并冲突解决之后。后续a分支和b分支再一次各自在同一个文件的第17行做了更改，这时候合并不会产生冲突，为什么？

原因是：第一次解决冲突后，合并后的结果成为 A 和 B 的共同祖先（共同基线）。后续的修改都基于这个共同基线进行，因此不会再冲突。

### 第一次合并冲突之后
![第一次合并](../images/git-conflict-1.png)
### 第二次合并不产生冲突
![第二次合并](../images/git-conflict-2.png)
### 两次合并之后的Git Graph
![两次合并后的源代码管理图形](../images/git-conflict-gui.png)

---
参考：
- [关于合并冲突 - GitHub 文档](https://docs.github.com/zh/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts)
- [在 VS Code 中使用 Git 版本控制](https://code.visualstudio.com/docs/sourcecontrol/overview#_merge-conflicts)
