---
title: Hello，IOC
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

## 概念

IOC：控制反转

首先在传统Java程序设计中有两种控制方式：

- 主动式：需要时主动new创建资源

  ```java
  var person = new Person();
  ```

- 被动式：由容器管理资源，需要时获取引用

  ```java
  var person = context.getResource("Person");
  ```

主动式需要自己创建资源，在需要复杂配置时，可能变得非常麻烦。所以采用被动式控制会简化开发。

spring实现IOC的方法：给定bean定义，给定xml配置文件，一个xml文件对应一个容器。spring会在创建容器时根据xml里的配置初始化所有bean，然后可以通过容器进行访问。

## 安装Spring

这里使用spring-boot快速安装。

1. 创建Maven项目，设定语言级别到1.8以上

2. 编辑pom，写入以下内容：

   ```xml
   	<parent>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-parent</artifactId>
           <version>2.3.0.RELEASE</version>
      	</parent>
   
       <dependencies>
           <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter -->
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter</artifactId>
           </dependency>
           <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-test -->
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-test</artifactId>
           </dependency>
       </dependencies>
   ```

3. 安装依赖到本地。具体步骤各个IDE都不一样，在此不详述。

上述步骤后，spring-core，junit等需要用到的库就安装完成了。

## 实现

给定Student Bean（省略getter/setter）：

```java
public class Student {
    private String name;
    private Integer age;
    private String email;
}
```

给定配置文件：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean class="cn.milolab.ioc.Student" name="student">
        <property name="age" value="18"/>
        <property name="email" value="30"/>
        <property name="name" value="40"/>
    </bean>
</beans>
```

创建一个容器：

```java
var context = new ClassPathXmlApplicationContext("ioc.xml");
```

获取注册的bean：

```java
var student = (Student) context1.getBean("student");
System.out.println(student);
```

## 规范

### bean

- java bean的属性名由getter/setter决定，而非由存储属性决定

### 容器配置文件

- bean标签：

  ```xml
  <bean class="全类名" name/id="组件在容器内的标识符">
      <!-- 初始化参数 -->
  </bean>
  ```

- spring容器配置文件的中的bean有两种构造方式：

  - 通过setter给存储属性赋值，此时会调用无参构造器构造对象，然后用setter赋值。如：

    ```xml
    <property name="属性名" value="属性值"/>
    ```

  - 提供构造器参数的值，通过有参构造器创建对象，是主要的创建方法。如：

    ```xml
    <constructor-arg name="参数名" value="参数值" index="参数下标" type="参数全类名"/>
    ```

    其中只有value是必须的。

  这些标签应写在bean标签下。

### 使用容器

容器，即`ApplicationContext`接口，有两个实现类，分别是`ClassPathXmlApplicationContext`和`FileSystemXmlApplicationContext`。他们分别从`classpath`和文件流中读取容器配置文件。

```java
var context1 = new ClassPathXmlApplicationContext("ioc.xml");
```

`ApplicationContext.getBean()`方法用于获取容器中的组件。有三种常用的重载：

- `getBean(String s)`：用组件的标识符获取组件。需要类型转换。
- `getBean(Class<T> aClass)`：用组件的类对象获取组件。有两个以上的同类组件会抛出异常。

- `getBean(String s, Class<T> aClass)`：用组件的类对象和标识符获取组件。

如：

```java
(Student) context1.getBean("student");
context1.getBean(Student.class);
context1.getBean("student", Student.class);
```

