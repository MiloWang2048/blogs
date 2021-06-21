---
title: Spring 常用注解
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

## IOC相关

### Configuration

`@Configuration`：标注于类上，标志这个类是一个配置类，相当于一个容器xml配置文件。

通过

```java
new AnnotationConfigApplicationContext(Config.class);
```

获取容器实例。

### ComponentScan

`@ComponentScan`用于自动包扫描，等效于`<context:component-scan>`，一个类可以写多个。

用法：

```java
@Configuration
@ComponentScan(value = "cn.milolab.annotation_test")
public class Config {}
```

### Bean

`@Bean`标注在配置类的方法上，用于注入一个组件。类型为返回值类型，默认id为方法名，也可以指定id：

```java
@Bean("stu1")
public Student student(){
    return new Student("milo", 20);
}
```

> 也可以通过这个注解指定`init-method`和`destroy-method`

### Controller、Service、Repository和Component

标注了这些注解的类，spring会自动将其注入容器，分成四个只是为了语义，没有本质区别。

需要自动包扫描。

### Autowired

`@Autowired`注解标注一个**组件的**成员变量，spring会自动根据类型和名称来注入组件的引用。

### Scope

`@Scope`标注在组件上，指定该组件是单例还是多实例模式。相当于bean标签的scope属性。

```java
@Bean
@Scope("prototype")
public Student student(){
    return new Student("milo", 20);
}
```

### Lazy

`@Lazy`标注在单例组件上，表示该组件在第一次获取时初始化。

```java
@Bean
@Lazy
public Student student(){
    return new Student("milo", 20);
}
```

### Conditional

`@Conditional`用于条件判断，只有当所有给出的条件均满足时才会将组件注入容器。

```java
@Bean
@Conditional({ACondition.class})
public Student student(){
    return new Student("milo", 20);
}
```

其中`ACondition`的定义如下：

```java
public class ACondition implements Condition {
    @Override
    public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // logical judgement statements
        return false;
    }
}
```

### Import

`@Import`用于装入不可操作源码的组件。例如：

```java
@Configuration
@Import(Student.class)
public class Config {}
```

其中，`Student`必须具有零参构造器，组件默认id是全类名。

> `@Import`也可以接受一个数组作为参数，其中的元素可以是`Class`对象、`ImportSelector`或`ImportBeanDefinitionRegistrar`。

### PropertySource

`@PropertySource`标注在配置类上，相当于`<context:properties-placeholder>`。接受一个字符串为参数，可以是一个类路径或者URL。

### Value

`@Value`标注于组件成员上，用于给成员注入值。参数可以是字符串、properties插值、SpEL。

### 工厂模式

来看看如何在不写配置文件的情况下使用工厂模式注册组件。

编写一个工厂类，实现`FactoryBean`接口，并通过`@Component`注册进容器：

```java
package cn.milolab.annotation_test;

import org.springframework.beans.factory.FactoryBean;

@Component
public class StudentFactory implements FactoryBean<Student> {
    @Override
    public Student getObject() throws Exception {
        return new Student("milo", 22);
    }

    @Override
    public Class<?> getObjectType() {
        return Student.class;
    }
    
    @Override
    public boolean isSingleton() {
        return false;
    }
}
```

可以看到他继承了`FactoryBean`接口。实现了这个接口后，Spring就知道他是一个工厂类了，会自动根据他创建一个`Student`类型的组件。编写测试，查看结果：

```java
@Test
public void test(){
    var context = new AnnotationConfigApplicationContext(Config.class);
    var stu = context.getBean(Student.class);
    System.out.println(stu);
}
```

输出：

```
Student{name='milo', age=22}
```

### 组件生命周期

可以在`@Bean`注解上声明初始化和销毁方法。除此之外，也可以实现`InitializingBean`和`DisposableBean`来实现初始化、销毁方法。

首先有`Student`类实现了`InitializingBean`和`DisposableBean`：

```java
public class Student implements InitializingBean, DisposableBean {
    private String name;
    private Integer age;

    @Override
    public void destroy() throws Exception {
        System.out.println(name + " destroying...");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println(name + " created...");
    }
}
```

测试：

```java
@Test
public void test(){
    var context = (ConfigurableApplicationContext) new AnnotationConfigApplicationContext(Config.class);
    var stu = context.getBean(Student.class);
    System.out.println(stu);
    context.close();
}
```

输出：

```
milo created...
Student{name='milo', age=4}
milo destroying...
```

**注意：如果通过工厂Bean注册组件，则需要在工厂类上实现这两个接口。**例如：

```java
package cn.milolab.annotation_test;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class StudentFactory implements FactoryBean<Student>, InitializingBean, DisposableBean {
    @Autowired
    Student student;

    @Override
    public Student getObject() throws Exception {
        return new Student("milo", 22);
    }

    @Override
    public Class<?> getObjectType() {
        return Student.class;
    }

    @Override
    public boolean isSingleton() {
        return false;
    }

    @Override
    public void destroy() throws Exception {
        System.out.println(student.getName() + " destroying...");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println(student.getName() + " created...");
    }
}
```

## AOP相关



### Aspect

