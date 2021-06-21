---
title: Spring AOP代理对象的类型
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

## 代理类型

先说结论：

- 如果目标类实现了某个接口，则代理类型为接口类型
- 如果目标类没有实现任何接口，则代理类型为目标类型

### 实现接口的情况

若有接口`Student`：

```java
package cn.milolab.aop;

public interface Student {
    public void learn();
}
```

且有实现类`StudentImpl`：

```java
package cn.milolab.aop;

import org.springframework.stereotype.Repository;

@Repository
public class StudentImpl implements Student {
    @Override
    public void learn(){
        System.out.println("learning...");
    }
}
```

切面类`StudentAspect`：

```java
package cn.milolab.aop;

import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class StudentAspect {
    @Before("execution(public void cn.milolab.ioc.StudentImpl.*())")
    public static void before(){
        System.out.println("before method running...");
    }

    @After("execution(public void cn.milolab.ioc.StudentImpl.*())")
    public static void after(){
        System.out.println("after method running...");
    }

    @AfterReturning("execution(public void cn.milolab.ioc.StudentImpl.*())")
    public static void afterReturning(){
        System.out.println("after method returning...");
    }

    @AfterThrowing("execution(public void cn.milolab.ioc.StudentImpl.*())")
    public static void afterThrowing(){
        System.out.println("before method throwing...");
    }
}
```

则需要以`Student`接口来获取引用：

```java
@Autowired
Student student;

@Test
public void test(){
    student.learn();
    System.out.println(student.getClass().getInterfaces()[0]);
}
```

输出：

```
before method running...
learning...
after method running...
after method returning...
interface cn.milolab.ioc.Student
```

可以看出，返回的代理对象是一个实现了`Student`接口的对象。

### 没有实现接口的情况

设有学生类`StudentImpl`没有实现任何接口：

```java
package cn.milolab.aop;

import org.springframework.stereotype.Repository;

@Repository
public class StudentImpl {
    public void learn(){
        System.out.println("learning...");
    }
}
```

有切面类`StudentAspect`：

```java
package cn.milolab.aop;

import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class StudentAspect {
    @Before("execution(public void cn.milolab.ioc.StudentImpl.*())")
    public static void before(){
        System.out.println("before method running...");
    }

    @After("execution(public void cn.milolab.ioc.StudentImpl.*())")
    public static void after(){
        System.out.println("after method running...");
    }

    @AfterReturning("execution(public void cn.milolab.ioc.StudentImpl.*())")
    public static void afterReturning(){
        System.out.println("after method returning...");
    }

    @AfterThrowing("execution(public void cn.milolab.ioc.StudentImpl.*())")
    public static void afterThrowing(){
        System.out.println("before method throwing...");
    }
}
```

则需要以`StudentImpl`类来获取引用：

```java
@Autowired
StudentImpl studentImpl;

@Test
public void test(){
    studentImpl.learn();
    System.out.println(studentImpl.getClass().getSuperclass());
}
```

输出：

```
before method running...
learning...
after method running...
after method returning...
class cn.milolab.ioc.StudentImpl
```

可以看出，代理类是`StudentImpl`的一个子类。