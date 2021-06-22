---
title: Spring笔记 - Spring AOP连接点获取目标方法信息
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

在监听方法上加入一个`JoinPoint`类型的参数，就可以获得目标方法的相关信息。例如：

```java
@Before("execution(public void cn.milolab.aop.StudentImpl.*())")
public static void before(JoinPoint joinPoint){
    System.out.println("before method running...");
    // 获取参数表
    System.out.println(Arrays.toString(joinPoint.getArgs()));
    // 获取目标对象
    System.out.println(joinPoint.getTarget());
    // 获取方法签名
    System.out.println(joinPoint.getSignature());
    // 获取切入点表达式的类型
    System.out.println(joinPoint.getKind());
    // 获取目标方法的this
    System.out.println(joinPoint.getThis());
    // 获取切入点表达式的实际值（代入通配符后的值）
    System.out.println(joinPoint.getStaticPart());
}
```

输出：

```
before method running...
[]
cn.milolab.aop.StudentImpl@6293e39e
void cn.milolab.aop.StudentImpl.learn()
method-execution
cn.milolab.aop.StudentImpl@6293e39e
execution(void cn.milolab.aop.StudentImpl.learn())
```

## 获取返回值

1. 先让方法返回一个值：

   ```java
   public Integer learn(){
       System.out.println("learning...");
       return 1;
   }
   ```

2. 在监听方法上添加一个`Object`参数，并在注解上标注returning="参数名"

   ```java
   @AfterReturning(value = "execution(public * cn.milolab.aop.StudentImpl.*())", returning = "returnValue")
   public static void afterReturning(Object returnValue){
       System.out.println("after method returning...");
       System.out.println(returnValue.toString());
   }
   ```

3. 输出：

   ```
   after method returning...
   1
   ```

> 如果方法是void，则返回值为null

## 获取异常

1. 先让方法抛一个异常：

   ```java
   public void learn(){
       System.out.println("learning...");
       throw new RuntimeException("run time exception...");
   }
   ```

2. 在监听方法上添加一个`Exception`参数，标注throwing="参数名"

   ```java
   @AfterThrowing(value = "execution(public * cn.milolab.aop.StudentImpl.*())", throwing = "exception")
   public static void afterThrowing(Exception exception){
       System.out.println("before method throwing...");
       System.out.println(exception.getMessage());
   }
   ```

3. 输出：

   ```
   after method throwing...
   run time exception...
   ```