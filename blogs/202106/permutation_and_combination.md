---
title: 枚举算法 - 排列与组合
date: 2021-6-22
categories:
  - Basic Algorithms
publish: true
---

枚举法中，与排列组合相关的问题都可以用全排列枚举和组合枚举解决（`A(m, n) = C(m, n) * A(n, n)`）。以下介绍二者的对应思路和代码模板。本例使用go编写。

> 参考链接：
>
> [字典排序算法（通俗易懂）_Hi,Mr.Wang的博客-CSDN博客_字典排序](https://blog.csdn.net/qq_34672688/article/details/79557380)
>
> [#算法证明#证明字典序全排列生成算法及实现_LoHiauFung的博客-CSDN博客](https://blog.csdn.net/LoHiauFung/article/details/52901564)
>
> [组合 - 组合 - 力扣（LeetCode） (leetcode-cn.com)](https://leetcode-cn.com/problems/combinations/solution/zu-he-by-leetcode-solution/)

## 全排列枚举

全排列，即`A(m, m)`，我们可以选择对

```go
package main

func main() {
	fullPermutation(3, func(arr []int) {
		for _, v := range arr {
			print(v, " ")
		}
		println()
	})
}

func fullPermutation(m int, callback func([]int)) {
	// arr存储下标
	arr := make([]int, m)
	for i := 0; i < m; i++ {
		arr[i] = i
	}
	// 第一种排列
	callback(arr)
	var i, j int
	for {
		// 从右向左找i使得arr[i] > arr[i+1]
		i = len(arr) - 2
		for i >= 0 && arr[i] >= arr[i+1] {
			i--
		}
		// 没找到则排列完成
		if i < 0 {
			break
		}
		// 从右向左找j使得arr[j] > arr[i]
		for j = len(arr) - 1; j >= 0; j-- {
			if arr[j] > arr[i] {
				break
			}
		}
		// 交换arr[i]和arr[j]
		arr[i], arr[j] = arr[j], arr[i]
		// 翻转arr[i]之后的元素
		reverseSlice(arr[i+1:])
		// 调用callback
		callback(arr)
	}
}

// 翻转一个切片
func reverseSlice(arr []int) {
	i, j := 0, len(arr)-1
	for i < j {
		arr[i], arr[j] = arr[j], arr[i]
		i++
		j--
	}
}
```

输出：

```
0 1 2 
0 2 1 
1 0 2 
1 2 0 
2 0 1 
2 1 0 
```



## 组合枚举

组合枚举，枚举`C(m, n)`所代表的所有组合。

```go
package main

func main() {
	combine(4, 3, func(t []int) {
		for _, v := range t {
			print(v, " ")
		}
		println()
	})
}
// 封装函数，从m个中选n个，每种组合调用一次callback
func combine(m, n int, callback func(t []int)) {
	dfs(0, m, n, make([]int, 0), callback)
}

// 回溯dfs
// curr代表当前迭代正在决策第curr位的取舍
// m和n代表从m个中选n个
// res用于存放结果数组，初始为空，当满时表示一次搜索结束
// callback当每次搜索结束时调用
func dfs(curr, m, n int, res []int, callback func([]int)) {
	// 如果当前已经选择的个数加上剩余待决策数量依然小于期望的选择数量则搜索失败，剪枝
	if len(res)+(m-curr) < n {
		return
	}
	// 期望选择数等于当前选择数组的长度，搜索成功，调用callback
    // 为防止callback修改原数组，需做拷贝操作
	if len(res) == n {
		t := make([]int, n)
		copy(t, res)
		callback(t)
		return
	}
	// 将当前下标移入待选数组
	res = append(res, curr)
	// 选择当前位的下一个迭代
	dfs(curr+1, m, n, res, callback)
	// 当前下标移出待选数组
	res = res[:len(res)-1]
	// 不选择当前位的下一个迭代
	dfs(curr+1, m, n, res, callback)
}
```

输出：

```
0 1 2 
0 1 3 
0 2 3 
1 2 3 
```

