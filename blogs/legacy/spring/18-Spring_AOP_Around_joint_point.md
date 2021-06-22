---
title: Spring笔记 - Spring AOP Around连接点
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

Around连接点是最强大的连接点，使用它甚至可以控制方法的执行。其实就是一个动态代理。

## 实例

有目标类`Student`：

```java
package cn.milolab.aop;

import org.springframework.stereotype.Repository;

@Repository
public class Student {
    public void learn(){
        System.out.println("learning...");
//        throw new RuntimeException("run time exception...");
    }
}

```

切面类`StudentAspect`：

```java
package cn.milolab.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class StudentAspect {

    @Pointcut("execution(public * cn.milolab.aop.Student.*())")
    public void pointcut(){}

    @Before("pointcut()")
    public static void before(JoinPoint joinPoint){
        System.out.println("before method running...");
    }

    @After("pointcut()")
    public static void after(){
        System.out.println("after method running...");
    }

    @AfterReturning(value = "pointcut()")
    public static void afterReturning(){
        System.out.println("after method returning...");
    }

    @AfterThrowing(value = "pointcut()")
    public static void afterThrowing(){
        System.out.println("after method throwing...");

    }

    @Around("pointcut()")
    public static Object around(ProceedingJoinPoint joinPoint){
        var args = joinPoint.getArgs();
        Object result = null;
        try {
            System.out.println("around method start...");
            result = joinPoint.proceed(args);
            System.out.println("around method return...");
        } catch (Throwable throwable) {
            System.out.println("around method catch...");
        }finally {
            System.out.println("around method finally...");
        }
        return result;
    }
}
```

测试：

```java
@Autowired
Student student;

@Test
public void test(){
    student.learn();
}
```

输出：

```
around method start...
before method running...
learning...
around method return...
around method finally...
after method running...
after method returning...
```

抛异常的输出：

```
around method start...
before method running...
learning...
around method catch...
around method finally...
after method running...
after method returning...
```

