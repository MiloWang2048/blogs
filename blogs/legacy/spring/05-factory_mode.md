---
title: Spring笔记 - 工厂模式
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

用容器配置文件配置非常复杂的组件时，往往需要非常复杂的结构。工厂模式可以简化这一过程。

## 工厂类

一个专门创建类的类，就是工厂。

- 静态工厂：工厂本身无需实例化，仅需调用静态方法即可创建对象。
- 实例工厂：工厂本身需要实例化，创建出的产品随上下文改变。需要调用实例方法来创建对象。

例如：

```java
// 静态工厂
public class Student {
    private String name;
    private String sex;
    private Integer age;

    public static Student getInstance() {
        return new Student();
    }
}
```

```java
// 实例工厂
public class StudentGenerator {
    private String baseName;
    public Student getStudent(){
        var stu = new Student();
        stu.setName(baseName);
        return stu;
    }
}
```

## 在容器配置文件中使用工厂来创建组件

### 静态工厂

步骤：

1. 创建一个bean，指向工厂类
2. 设定`factory-method`属性到静态工厂方法名
3. 在bean内部使用`constructor-arg`为工厂方法传递参数

例如：

```xml
<bean class="cn.milolab.ioc.Student" factory-method="getInstance">
    <constructor-arg name="age" value="12"></constructor-arg>
</bean>
```

## 实例工厂

步骤：

1. 配置一个工厂bean
2. 创建一个目标bean，并设定`factory-bean`
3. 使用`factory-method`指定工厂方法
4. 使用`constructor-arg`为工厂方法传递参数

例如：

```xml
<bean id="studentGenerator" class="cn.milolab.ioc.StudentGenerator">
    <property name="baseName" value="milo"></property>
</bean>
<bean class="cn.milolab.ioc.Student" factory-bean="studentGenerator" factory-method="getStudent">
    <constructor-arg name="age" value="12"></constructor-arg>
</bean>
```

## FactoryBean\<T\>接口

### 实现

所有实现了FactoryBean\<T\>接口的类，Spring都认为是一个实例工厂：

- `T`代表产品类型
- `public T getObject() throws Exception`：工厂方法
- `public Class<?> getObjectType()`：返回产品类型
-  `public boolean isSingleton()`：是否为单例模式

例如：

```java
package cn.milolab.ioc;

import org.springframework.beans.factory.FactoryBean;

public class StudentGenerator implements FactoryBean<Student> {
    private String baseName;

    @Override
    public Student getObject() throws Exception {
        var stu = new Student();
        stu.setName(baseName);
        return stu;
    }

    @Override
    public Class<?> getObjectType() {
        return Student.class;
    }

    @Override
    public boolean isSingleton() {
        return false;
    }

    public String getBaseName() {
        return baseName;
    }

    public void setBaseName(String baseName) {
        this.baseName = baseName;
    }
}
```

### 调用

基本步骤：

1. 创建一个工厂类的bean，使用正常手段为其赋值
2. spring会自动处理，实例化该工厂类并调用`getObject`方法，得到将要创建的对象
3. 在运行时用常规手段获取他

例如：

```xml
<bean class="cn.milolab.ioc.StudentGenerator" id="student">
    <property name="baseName" value="milo"></property>
</bean>
```

```java
var stu = context.getBean("student", Student.class);
System.out.println(stu);
```

很完美。