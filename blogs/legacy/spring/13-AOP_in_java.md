---
title: Spring笔记 - Java原生AOP
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

首先，java原生的AOP由`java.lang.reflect.Proxy`动态代理类提供支持，实现思路如下：

1. 为目标类定义接口，只能代理接口内定义的方法
2. 编写实现类
3. 编写切面类，实现一个`getProxy`方法，接受一个实现类对象，返回接口实现对象（描述不太好，请参照下面的例子）
4. 在此方法内部使用`Proxy.newProxyInstance`，结合对应逻辑创建代理对象，并返回
5. 外部代码通过此代理对象调用方法，就可以做到插入拦截

## 例子

有一个`Student`接口：

```java
package cn.milolab.aop;

public interface Student {
    public void learn();
}
```

并有一个实现类`StudentImpl`：

```java
package cn.milolab.aop;

public class StudentImpl implements Student {
    @Override
    public void learn(){
        System.out.println("learning...");
    }

}
```

创建`StudentAspect`切面类，实现`getProxy`方法：

```java
package cn.milolab.aop;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class StudentAspect {

    public static Student getProxy(StudentImpl studentImpl){
        var interfaces = studentImpl.getClass().getInterfaces();
        var classLoader = studentImpl.getClass().getClassLoader();
        var invocationHandler = new InvocationHandler(){
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                Object result = null;
                try {
                    System.out.println(String.format("before %s execution...", method.getName()));
                    result = method.invoke(studentImpl, args);
                    System.out.println(String.format("after %s execution...", method.getName()));
                } catch (Exception e) {
                    System.out.println(String.format("method %s failed...", method.getName()));
                } finally {
                    System.out.println(String.format("method %s done...", method.getName()));
                }
                return result;
            }
        };
        return (Student) Proxy.newProxyInstance(classLoader, interfaces, invocationHandler);
    }
}
```

编写测试方法，测试方法拦截：

```java
@Test
public void test(){
    var student = new StudentImpl();
    var proxy = StudentAspect.getProxy(student);
    proxy.learn();
}
```

输出：

```
before learn execution...
learning...
after learn execution...
method learn done...

Process finished with exit code 0
```

抛出一个异常：

```java
public class StudentImpl implements Student {
    @Override
    public void learn(){
        System.out.println("learning...");
        throw new RuntimeException();
    }
}
```

输出：

```
before learn execution...
learning...
method learn failed...
method learn done...

Process finished with exit code 0
```

以上，实现了一个简单的AOP示例。