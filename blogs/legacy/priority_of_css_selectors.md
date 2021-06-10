---
title: CSS选择器优先级计算
categories:
  - frontend
tags:
  - css
publish: true
---


## 定义

优先级是"为一个声明块内 所有CSS声明 分配的权重", 当DOM元素的同一CSS属性有超过一个定义时, 根据权重决定采用哪个.

CSS声明的优先级是一个确定的数值.

> 在W3C官方文档中, "CSS优先级" 的原文是`selector’s specificity`,也就是"选择器的具体程度"



## 计算

对每个声明块而言, 可能有4中不同的选择器参与优先级运算: 

| 类型 | 包含的选择器                     |
| ---- | -------------------------------- |
| A类  | 内联样式(其实不算选择器)         |
| B类  | ID选择器                         |
| C类  | 类选择器, 属性选择器, 伪类选择器 |
| D类  | 标签选择器, 伪元素选择器         |

可以定义优先级变量priority:

```js
var priority = {
    a:0,
    b:0,
    c:0,
    d:0
}
```

则对每个声明块而言, 每有一个A类选择器, `priority.a++`.

在比较优先级时, 从高位开始比较, 若相同则比较下一位, 若不同则直接返回结果.



## 关于!important

```css
.sample{ color: black !important;}
```

`!important`可以覆盖掉任何优先级(不包括他自己). 如果有多个选择器一样并且包含`!important`的声明, 后面的声明会覆盖掉前面的. 如果在内联样式中使用, 则此属性永远无法被外部改写.

**如果不是特别需要, 不要使用这个声明.**



## 参考和引用

> https://www.cnblogs.com/yugege/p/9918232.html
>
> https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity

