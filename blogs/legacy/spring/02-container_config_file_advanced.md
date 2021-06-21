---
title: 容器配置文件的高级赋值方式
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

## 使用p名称空间为组件的属性赋值

创建简单组件时，往往需要设置很多属性的值。使用spring提供的p名称空间能够减少基本属性赋值的代码量。

以前，我们定义一个组件，需要：

```xml
<bean class="cn.milolab.ioc.Student" name="student"></bean>
```

然后在标签体中插入`property`或`constructor-arg`子标签来初始化对象，有些麻烦。

p名称空间自动匹配组建的setter，以标签属性的形式为组件属性赋值。使用步骤如下：

1. 给`<beans>`标签添加属性`xmlns:p="http://www.springframework.org/schema/p"`导入命名空间

2. 在`<bean>`标签中使用`p:属性名`为组件属性赋值。例如：

   ```xml
   <bean class="cn.milolab.ioc.Student" name="student"
         p:age="18" p:email="email" p:name="milo">
   </bean>
   ```

## 复杂属性的赋值

对于复杂属性的赋值，都在`property`或`constructor-arg`标签的标签体中进行。例如：

```xml
    <bean class="cn.milolab.ioc.Student" name="student">
        <property name="name">
            <!-- 在这里对复杂属性进行赋值 -->
        </property>
    </bean>
```

### null

用`null`标签对属性赋空值：

```xml
<bean class="cn.milolab.ioc.Student" name="student">
    <property name="name">
        <null/>
    </property>
</bean>
```

### 对象

用`bean`标签赋值一个新的对象：

```xml
<property name="name">
    <bean class="java.lang.String">
        <constructor-arg value="milo"></constructor-arg>
    </bean>
</property>
```

### 引用

用`ref`属性引用已有对象：

```xml
<bean class="java.util.Scanner" name="scanner">
    <constructor-arg value="a string"></constructor-arg>
</bean>
<bean class="cn.milolab.ioc.Student" name="student">
    <property name="object" ref="scanner"></property>
</bean>
```

### List

使用`list`标签来创建`ArrayList`：

```xml
<property name="stringArrayList">
    <list>
        <bean class="java.lang.String">
            <constructor-arg value="11111"></constructor-arg>
        </bean>
        <bean class="java.lang.String">
            <constructor-arg value="22"></constructor-arg>
        </bean>
    </list>
</property>
```

注意，`list`标签只能为List接口赋值，而不能为他的实现类赋值（例如`ArrayList`），尽管他默认使用`ArrayList`。

### Map

使用`map`标签为Map类型赋值。默认类型为`LinkedHashMap`：

```xml
<property name="map">
    <map>
        <entry key="01" value="10"></entry>
        <entry>
            <key>
                <value>asd</value>
            </key>
            <value>dsa</value>
        </entry>
    </map>
</property>
```

### Properties

使用`props`标签为`Properties`属性赋值：

```xml
<property name="properties">
    <props>
        <prop key="123">321</prop>
        <prop key="456">654</prop>
    </props>
</property>
```

