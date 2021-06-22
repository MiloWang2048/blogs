---
title: Spring笔记 - 基于注解的自动装配
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

## 对成员使用自动装配

要进一步摆脱对xml配置文件的依赖，还可以使用`@Autowired`标记bean的成员进行自动装配。

例如：

```java
// Student类
package cn.milolab.ioc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class Student {
    private String name;
    private String sex;
    private Integer age;

    @Autowired
    private Book book;

    // 省略getter/setter和toString
}
```

```java
// Book类
package cn.milolab.ioc;

import org.springframework.stereotype.Repository;

@Repository
public class Book {
    private String name = "java core tech";
    private String author;

	// 省略getter/setter和toString
}
```

配置文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <context:component-scan base-package="cn.milolab.ioc"/>

</beans>
```

获取组件：

```java
@Test
public void testIOC() {
    var stu = context.getBean(Student.class);
    System.out.println(stu);
}
```

输出：

```
Student{name='null', sex='null', age=null, book=Book{name='java core tech', author='null'}}
```



## 对构造方法使用自动装配

对构造方法使用`Autowired`属性时，会自动为构造方法的每个参数赋值

```java
@Autowired
public Student(Book book){
    System.out.println("init student...");
    System.out.println(book);
    this.book = book;
}
```

输出：

```
init student...
Book{name='java core tech', author='null'}
Student{name='null', sex='null', age=null, book=Book{name='java core tech', author='null'}}
```



## 装配流程

装配操作的步骤如下：

1. 匹配目标bean类型
2. 如果没有，报错
3. 如果有多个，根据名称匹配（可以使用`@Qualifier`注解指定要搜索的组件名称）
4. 还没有匹配，就报错

> 注意，这两个类必须都被注入到容器中才能成功装配，否则会报错。这里使用注解+包扫描来注入。
> 
> `@Autowired`注解只能应用于非基本类型
> 
> `@Autowired`注解默认找不到bean会报错，如果希望找不到时装配null，可以使用`required = false`参数来说明。