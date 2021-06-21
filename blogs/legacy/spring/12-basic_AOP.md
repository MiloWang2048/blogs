---
title: AOP基础
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

Aspect Oriented Programming，面向切面编程，是OOP的有益补充。

一个接地气的定义：**在运行时，动态地将代码切入到指定类的指定方法、指定位置上的编程思想就是面向切面的编程。**

## 概念

- 目标类：将要进行切面的类
- 横切关注点：方法执行的所有关键位置（执行前、执行成功、执行失败、执行完毕）
- 通知方法：在横切关注点上执行的监听方法
- 切面类：提供通知方法的类
- 连接点：横切关注点和方法集的笛卡尔积（人话：下图中的蓝色小球）
- 切入点：实际监听的连接点

![AOP](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/image-20200607214630778.png)

## 如何实现

### 原生java

jdk提供了代理对象来实现基本的AOP。

### Spring AOP和AspectJ

spring aop包基于AspectJ提供了强大的AOP支持，需要导入相关的包。

