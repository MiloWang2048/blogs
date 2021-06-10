---
title: Protobuf笔记 - 环境安装和快速上手
date: 2021-5-30
categories:
  - backend
  - famework&libraries
tags:
  - Protobuf
publish: true
---

Protocol Buffers，又名Protobuf，是谷歌开发的语言无关、平台无关的二进制序列化技术，被广泛的用于进程间通信中。与Json、Xml不同，protobuf将结构化数据序列化为字节流，从而使得数据密度大大提高，但牺牲了可读性。非常适合那些需要大会规模数据交换的IPC场景。它也是gRPC的基底。



## 安装

protobuf有两个主要的组件需要我们安装：

### protoc编译器

protobuf compiler，负责将`.proto`数据定义文件编译为，可以直接下载[官方编译的可执行文件](https://github.com/protocolbuffers/protobuf/releases)。

解压之后将整个文件夹放到你的应用程序目录，然后将`bin`目录添加进系统path中。

测试安装：

![打印版本号](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210601101333.png)

### 对应语言的代码生成器

语言插件负责生成对应语言的代码。插件的仓库地址可以再protobuf[主仓库的readme](https://github.com/protocolbuffers/protobuf)中找到，对go而言，只需要运行：

```sh
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
```

就可以安装到`$GOPATH/bin`目录下。



## 开始使用

protobuf主要工作流是：

1. 定义消息结构
2. 生成模板代码（组合数据类型）
3. 序列化/反序列化

首先我们需要定义消息结构。



## 定义消息结构

protobuf使用proto语言（一种DDL）来定义数据结构，它的文件后缀名为`.proto`。我们现在编写一个proto文件，并尝试编译它：

1. 创建项目，运行：

   ```sh
   mkdir proto_test
   cd proto_test
   go mod init milolab.cn/proto_test
   ```

2. 在`proto/src`目录下编写`user.proto`文件：

   ```protobuf
   syntax = "proto3";
   
   package entity;
   
   option go_package = "milolab.cn/proto_test/entity";
   
   message User {
       int32 id = 1;
       string principal = 2;
       string credential = 3;
   }
   ```

   这个文件定义了一种消息`User`，用一个32位整数表示id，用两个字符串表示用户名和密码。



## 编译

运行：

```sh
protoc -I=proto --go_out=$GOPATH/src proto/*.proto
```

来编译proto文件。完成后，你会在`entity`目录下找到编译好的`user.pb.go`文件。此时文件中的依赖向未添加进go.mod，所以运行：

```sh
go mod tidy
```

来整理依赖。编译阶段完成。



## 测试运行

创建文件`app.go`，编写测试代码：

```go
package main

import (
	"google.golang.org/protobuf/proto"
	"io/ioutil"
	"milolab.cn/proto_test/entity"
)

func main() {
	user := &entity.User{Id: 32, Credential: "asd", Principal: "dsa"}
	bytes, _ := proto.Marshal(user)
	_ = ioutil.WriteFile("test.user", bytes, 0644)

	in, _ := ioutil.ReadFile("test.user")
	user = &entity.User{}
	_ = proto.Unmarshal(in, user)
	println(user.String())
}
```

执行：

```sh
go run .
```

输出：

```
id:32 principal:"dsa" credential:"asd"
```

大功告成。这段代码创建了一个user结构体并将其使用protobuf序列化为二进制数据写入`test.user`，随后将其读出并反序列化为结构体。

protobuf不关心数据如何传输。你可以使用合适的传输协议。
