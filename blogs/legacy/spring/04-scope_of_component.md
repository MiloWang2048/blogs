---
title: 容器组件的作用域
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

## 容器组件的作用域

可以使用`scope`属性来指定组件的作用域。

`scope`属性有四种取值：

- `prototype`多实例：在get时创建，每次得到一个新的组件
- `singleton`单实例（默认）：在容器启动前就创建好，每次get得到引用
- `request`一次请求一个实例
- `session`一次会话一个实例

一般只使用单实例和多实例。

例如：

```xml
<bean abstract="true" class="cn.milolab.ioc.Student"
      id="student1"
      p:name="s1"
      p:sex="male"
      p:age="18">
</bean>
<bean parent="student1" id="student2"></bean>
<bean parent="student1" id="student3" scope="prototype"></bean>
```

```java
System.out.println(
        context.getBean("student2", Student.class)
                == context.getBean("student2", Student.class));
System.out.println(
        context.getBean("student3", Student.class)
                == context.getBean("student3", Student.class));
```

输出：

```
true
false
```



