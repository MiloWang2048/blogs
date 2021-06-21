---
title: xml自动装配(autowire)
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

`autowire`是bean标签的一个属性，可以自动为bean的属性赋值。可能的取值如下：

- `default/no`：不自动装配
- `byName`：自动把容器中id/name为bean成员名的bean赋值给成员
- `byType`：自动把容器中类型为bean成员类型的bean赋值给成员，有多个会报错
- `constructor`：
  1. 找出bean的所有构造方法
  2. 如果容器内有对应类型的bean（类似于方法签名匹配）则以这些bean为参数调用符合的构造方法
  3. 如果类型找到了多个，根据参数名作为id进行匹配
  4. 还不行就装null，但不会报错



