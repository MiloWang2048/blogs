---
title: 重新认识REST API
date: 2021-6-15
categories:
  - Code style
publish: false
---

> 本文译自[What is REST (restfulapi.net)](https://restfulapi.net/)，旨在重新认识REST。
>
> 为了帮助读者更好的理解REST，对其中的一些不必要的描述作了删节。

### 什么是REST

**RE**presentational **S**tate **T**ransfer，表征状态转移，缩写为REST，是一种分布式超媒体系统的架构风格。它由Roy Fielding于2000年在他的[论文](https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm)中提出。

REST定义了六条规则，凡是遵守这六条规则的接口设计都能够称之为RESTful。

## RESTful API的六大原则

- **Client–server** – 通过分离UI和逻辑，提升了UI的跨平台可移植性；通过简化服务端组件，提升了服务端组件的可扩展性。
- **Stateless** – 每个请求都能够独立的被服务端理解，并且不能利用任何存储在服务器上的上下文；所以，会话状态始终存储在客户端中。
- **Cacheable** – 响应应当能够被标记为可缓存或不可缓存。
- **Uniform interface** – 接口应当遵循统一的标准。在REST中，有四个接口约束：
  - 资源标识
  - 表征式资源操纵
  - 自描述消息
  - 使用超媒体作应用程序的状态引擎
- **Layered system** – 系统架构可以由有结构的层级组成，这样就可以对组件的作用域进行限制，例如组件只能“看”到与他直接交互的那一层中的其他组件。
- **Code on demand (可选)** – REST允许客户端下载并执行远程代码。这减少了构建原型所需的特性数量。



## 资源

**资源**是REST中对信息的抽象。任何能够被命名的信息都是一个资源，例如文档或图片、临时服务等。REST使用资源标识符在不同的组件中识别资源。

资源在任意时刻的状态称为表征。表征由下列元素组成：

- 数据
- 元数据：描述数据的数据
- 超媒体链接：帮助客户端过渡到下一状态的资源

表征的数据格式称作**media type**（媒体类型），媒体类型指导一个表征的处理流程。一个符合标准的RESTful API看起来就像一个超链接一样。每一个可编址的信息单元都显式（例如一个带有id或属性的链接）或隐式（从媒体类型或表征结构派生）地含有一个地址。

据Roy Fielding说：

> 超媒体是



