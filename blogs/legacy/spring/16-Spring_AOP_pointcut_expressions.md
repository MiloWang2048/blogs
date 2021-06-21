---
title: Spring AOP切入点表达式的语法
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

## 固定格式

```
execution(访问修饰符 返回值类型 方法全名(参数表))
```

注意，切入点表达式中类名**必须使用全类名**

## 通配符

- `*`：匹配一个或多个字符，或一个任意参数类型（不能写在权限位置）

  ```
  execution(public void cn.milolab.aop.StudentImpl.*())
  execution(public void cn.milolab.aop.StudentImpl.*(int, *))
  ```

- `..`匹配任意多个参数，或任意多层路径

  ```
  execution(public void cn.milolab.aop.StudentImpl.*(..))
  execution(public void cn.milolab..*())
  ```

## 逻辑条件组合

没想到吧？切入点表达式还支持逻辑运算组合。

有以下三种运算符：

- `&&`：与
- `||`：或
- `!`：非

例如：

```
execution(public void cn.milolab.aop.StudentImpl.*(int, int)) || execution(public void cn.milolab.aop.StudentImpl.*(int, double))
```

