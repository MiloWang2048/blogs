---
title: Protobuf笔记 - Protobuf API
date: 2021-6-25
categories:
  - backend
  - famework&libraries
tags:
  - Protobuf
publish: true
---

> 参考链接：[proto · pkg.go.dev](https://pkg.go.dev/google.golang.org/protobuf/proto)

本文解释protobuf生成的Go代码的API。阅读本文章需要一些Protobuf的基本知识。如果你还不知道如何使用Protobuf，请参阅我以前的文章。

## 安装

要使用Protobuf提供的API，你只需要引入：

```go
import "google.golang.org/protobuf/proto"
```

然后运行：

```sh
go mod tidy
```

就可以使用`proto`包下的所有API了。

## API概览

### 序列化

| 函数              | 描述                               |
| ----------------- | ---------------------------------- |
| `proto.Size`      | 能够计算一个消息被序列化之后的大小 |
| `proto.Marshal`   | 序列化一个消息                     |
| `proto.Unmarshal` | 反序列化一个消息                   |

### 基本消息操作

| 函数                      | 描述                                         |
| ------------------------- | -------------------------------------------- |
| `proto.Clone`             | 深拷贝一个消息                               |
| `proto.Merge`             | 将一个消息中的数据合并到另一个中             |
| `proto.Equal`             | 判断两个消息是否相等                         |
| `proto.Reset`             | 还原消息到零值                               |
| `proto.CheckInitialized ` | 检查所有required字段均不为空（proto3中废弃） |

还有一些API是proto2专有的，这里不做介绍。



## 实例

给出以下消息定义：

```protobuf
message User {
    int32 id = 1;
    string name = 2;
    int32 grade = 3;
}
```

于是我们可以这样操作：

```go
package main

import (
   "fmt"
   "google.golang.org/protobuf/proto"
   "milolab.cn/proto_test/entity"
)

func main() {
   user := &entity.User{Id: 32, Name: "milo", Grade: 2018}
   fmt.Println(user.String())
   // id:32  name:"milo"  grade:2018

   fmt.Println(proto.Size(user))
   // 11

   bytes, _ := proto.Marshal(user)
   for _, v := range bytes {
      fmt.Printf("%02x ", v)
   }
   fmt.Println()
   // 08 20 12 04 6d 69 6c 6f 18 e2 0f 

   user2 := &entity.User{}
   _ = proto.Unmarshal(bytes, user2)
   fmt.Println(user2.String())
   // id:32  name:"milo"  grade:2018

   fmt.Println(proto.Equal(user, user2))
   // true

   proto.Reset(user)
   fmt.Println(user.String())
   // <空字符串>

   proto.Merge(user, user2)
   fmt.Println(user.String())
   // id:32  name:"milo"  grade:2018
}
```
