---
title: 容器组件的抽象和继承
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

## 继承组件

在一个组件上使用`parent`属性来继承其他组件的配置：

```xml
<bean class="cn.milolab.ioc.Student"
      id="student1"
      p:name="s1"
      p:sex="male"
      p:age="18">
</bean>
<bean parent="student1"></bean>
```

## 抽象组件

在一个组件上使用`abstract`属性阻止该组件被java代码获取。

```xml
<bean abstract="true" class="cn.milolab.ioc.Student"
      id="student1"
      p:name="s1"
      p:sex="male"
      p:age="18">
</bean>
<bean parent="student1" id="student2"></bean>
```

尝试获取student1：

```java
ApplicationContext context1 = new ClassPathXmlApplicationContext("ioc.xml");
Student student1 = context1.getBean("student1", Student.class);
```

报错：

```
org.springframework.beans.factory.BeanIsAbstractException: Error creating bean with name 'student1': Bean definition is abstract
```

