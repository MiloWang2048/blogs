---
title: Spring笔记 - 组件生命周期
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

spring为组件提供了一组生命周期方法：

- `init-method`：属于组件的成员，在组件被创建时调用
- `destroy-method`：属于组件的成员，在组件被销毁时调用

## 单实例组件

单实例组件的生命周期如下：

1. 容器创建
2. 组件构造方法
3. 组件`init-method`
4. 组件`destroy-method`
5. 容器关闭

例如：

```xml
<bean class="cn.milolab.ioc.Student"
      id="student"
      scope="singleton"
      init-method="init"
      destroy-method="destroy">
    <property name="name" value="milo"></property>
</bean>
```

```java
@Test
    public void testIOC() {
        var stu = context.getBean("student", Student.class);
        System.out.println(stu);
        context.close();
    }
```

输出：

```
15:45:36.763 [main] DEBUG org.springframework.beans.factory.support.DefaultListableBeanFactory - Creating shared instance of singleton bean 'student'
Student init...
Student{name='milo', sex='null', sge=null}
15:45:36.932 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Closing org.springframework.context.support.ClassPathXmlApplicationContext@3e92efc3, started on Fri Jun 05 15:45:36 CST 2020
Student destroy...
```

## 多实例组件

多实例组件在获取时被创建，在容器被销毁时销毁。

1. 容器创建
2. 获取组件实例
3. 组件`init-method`
4. 容器关闭

**不会调用destroy-method。**

例如：

```xml
<bean class="cn.milolab.ioc.Student"
      id="student"
      scope="prototype"
      init-method="init"
      destroy-method="destroy">
    <property name="name" value="milo"></property>
</bean>
```

```java
@Test
public void testIOC() {
    var stu = context.getBean("student", Student.class);
    System.out.println(stu);
    context.close();
}
```

输出：

```
Student init...
Student{name='milo', sex='null', sge=null}
15:47:15.379 [main] DEBUG org.springframework.context.support.ClassPathXmlApplicationContext - Closing org.springframework.context.support.ClassPathXmlApplicationContext@3e92efc3, started on Fri Jun 05 15:47:14 CST 2020

Process finished with exit code 0
```

