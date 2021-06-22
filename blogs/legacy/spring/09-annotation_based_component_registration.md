---
title: Spring笔记 - 基于注解的自动组件注入
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

Spring提供了下列组件，可以自动将bean注入容器：

- `@Controller`：控制器
- `@Service`：服务
- `@Repository`：数据层
- `@Component`：通用组件

以上四个注解本质上没有区别，只是为了可读性区分开来。

## 使用步骤

1. 给bean上标注解
2. 配置自动扫描（依赖`context:component-scan`）
3. 要有aop支持，spring-boot项目可以自动配置
4. 自动注入的组件默认名称是类名的camelCase，也可以给注解加字符串参数来指定名称

> 注意：context命名空间需要在xsi:schemaLocation中添加对应的xsd验证文件URI。
>
> 在IDEA中，没有手动导入context名称空间的情况下，根据语法提示打入一个context名称空间下的标签就可以自动添加xsd

## 多实例模式

使用`@Scope`注解来指定组件以单例模式还是多实例模式工作，例如：

```java
@Scope(value = "prototype")
```

## 完整示例

组件：

```java
package cn.milolab.ioc;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;

@Repository("s1")
@Scope(value = "singleton")
public class Student {
    private String name;
    private String sex;
    private Integer age;

    @Override
    public String toString() {
        return "Student{" +
                "name='" + name + '\'' +
                ", sex='" + sex + '\'' +
                ", sge=" + age +
                '}';
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
```

容器配置文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">

    <context:component-scan base-package="cn.milolab.ioc"/>

</beans>
```

调用组件：

```java
@Test
public void testIOC() {
    var stu = context.getBean("s1", Student.class);
    System.out.println(stu);
    context.close();
}
```

输出：

```java
Student{name='null', sex='null', sge=null}
```



