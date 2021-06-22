---
title: Spring笔记 - 在容器中引用properties文件
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

在容器中可以通过引用properties文件来简化配置。

## 导入命名空间

此功能依赖`context`名称空间。定义位于[http://www.springframework.org/schema/context](http://www.springframework.org/schema/context)

在容器配置文件的根元素上写入：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
</beans>
```

## 导入properties属性

使用`context:property-placeholder`标签导入properties属性。

```xml
<context:property-placeholder location="config.properties"></context:property-placeholder>
```

此时properties中的属性已经保存在容器上下文中，使用`${}`进行插值：

```xml
<property name="name" value="${db.username}"></property>
```

> 注意，`username`是spring的一个关键字，如果直接使用`${username}`的话，容器创建时会卡住。