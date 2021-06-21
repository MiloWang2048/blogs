---
title: 基于Spring的AOP
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

## 为什么要使用Spring AOP？

java原生AOP的缺点：

1. 编写复杂
2. 只能监听接口中定义的方法

所以为了简化AOP，Spring提供了一组更为强大的AOP支持。

## 使用步骤

1. 安装aop依赖：

   ```xml
   <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-aop -->
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-aop</artifactId>
   </dependency>
   ```

2. 编写目标类，加入容器

   ```java
   package cn.milolab.aop;
   
   import org.springframework.stereotype.Repository;
   
   @Repository
   public class Student {
       public void learn(){
           System.out.println("learning...");
       }
   }
   ```

3. 编写切面类，加入容器，设置为切面类

   ```java
   package cn.milolab.aop;
   
   import org.aspectj.lang.annotation.Aspect;
   import org.springframework.stereotype.Component;
   
   @Component
   @Aspect
   public class StudentAspect {
   
       public static void before(){
           System.out.println("before method running...");
       }
   
       public static void after(){
           System.out.println("before method running...");
       }
   
       public static void afterReturning(){
           System.out.println("before method running...");
       }
   
       public static void afterThrowing(){
           System.out.println("before method running...");
       }
   }
   ```

4. 写容器配置文件，启用自动包扫描，启用基于注解的AOP功能

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xmlns:aop="http://www.springframework.org/schema/aop"
          xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd http://www.springframework.org/schema/aop https://www.springframework.org/schema/aop/spring-aop.xsd">
   
       <context:component-scan base-package="cn.milolab.aop"/>
       <aop:aspectj-autoproxy></aop:aspectj-autoproxy>
   
   </beans>
   ```

5. 标注切入点

   ```java
   package cn.milolab.aop;
   
   import org.aspectj.lang.annotation.*;
   import org.springframework.stereotype.Component;
   
   @Component
   @Aspect
   public class StudentAspect {
       @Before("execution(public void cn.milolab.aop.Student.*())")
       public static void before(){
           System.out.println("before method running...");
       }
       
       @After("execution(public void cn.milolab.aop.Student.*())")
       public static void after(){
           System.out.println("after method running...");
       }
       
       @AfterReturning("execution(public void cn.milolab.aop.Student.*())")
       public static void afterReturning(){
           System.out.println("after method returning...");
       }
       
       @AfterThrowing("execution(public void cn.milolab.aop.Student.*())")
       public static void afterThrowing(){
           System.out.println("before method throwing...");
       }
   }
   ```

6. 测试：

   ```java
   @Test
   public void test(){
       student.learn();
   }
   ```

7. 输出：

   ```
   before method running...
   learning...
   after method running...
   after method returning...
   ```

Spring YES！！！

