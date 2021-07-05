---
title: gRPC - Overview
date: 2021-6-29
categories:
  - backend
  - famework&libraries
tags:
  - gRPC
publish: true
---

本文介绍gRPC的概况和其设计概念。gRPC使用protobuf作为其底层数据传输协议，所以如果你还不了解protobuf，可以参考我以前的博客。

> 参考链接：
>
> [Introduction to gRPC | gRPC](https://grpc.io/docs/what-is-grpc/introduction/)
>
> [Core concepts, architecture and lifecycle | gRPC](https://grpc.io/docs/what-is-grpc/core-concepts/)

## 概览

在gRPC中，我们首先会定义service。service定义了一些方法，这些方法应当由客户端调用，在远端上执行。服务端程序会先实现service中定义好的所有接口，然后启动一个gRPC server监听外部的调用请求。客户端应用程序会被注入一个`stub`（桩模块）。桩模块会代理RPC调用，在远程机器上执行真正的逻辑。

![gRPC](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210705093943.png)

就gRPC而言，它是polyglot的，也就是说你可以用很多兼容的语言编写客户端/服务端，并且可以实现跨语言调用（这主要是因为protobuf的语言无关性）。

## gRPC中的Protobuf

默认情况下，gRPC使用Protobuf进行通信。考虑以下proto文件：

```protobuf
service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```

是的，你可以在proto文件中直接定义service和其上的rpc method。同时你需要给出方法的参数表、返回值和对应的消息结构。以上就是一个最简单的gRPC接口定义文件了。

gRPC使用`protoc`和一个特定的插件来编译`proto`文件。下一篇博客我们来具体介绍整套流程。

## 核心概念

### rpc方法类型

在gRPC中有四种rpc方法：

- 简单RPC：调用服务，返回结果

  ```protobuf
  rpc SayHello(HelloRequest) returns (HelloResponse);
  ```

- 流式响应RPC：服务返回一个Stream，客户端读取这个stream知道没有元素为止

  ```protobuf
  rpc LotsOfReplies(HelloRequest) returns (stream HelloResponse);
  ```

- 流式请求RPC：向服务发送一个Stream，服务端读取完成后处理，并返回结果

  ```protobuf
  rpc LotsOfGreetings(stream HelloRequest) returns (HelloResponse);
  ```

- 全双工RPC：客户端向服务端流式发送数据，服务端也向客户端流式响应数据

  ```protobuf
  rpc BidiHello(stream HelloRequest) returns (stream HelloResponse);
  ```

### 使用gRPC API

- 在服务端，你只需要实现gRPC生成的接口定义即可
- 在客户端，你也只需要去调用gRPC生成的桩模块，gRPC会处理通信问题

#### 同步vs异步

在大多数语言的实现中，gRPC同时提供同步和异步调用。

### RPC生命周期

#### 简单RPC

1. 客户端调用桩模块中的rpc方法，服务端收到通知，带有本次请求的元信息，如方法名或超时时间等
2. 服务端可以选择发回自己的元信息或是等到所有请求数据接受完成再发回
3. 服务端收到完整请求，开始生成响应，生成完成后返回响应和元信息
4. 如果响应状态OK，完成一次RPC调用

#### 流式响应RPC和流式请求RPC

与简单RPC类似，只不过在处理完所有流式请求/响应后调用过程才会结束。

#### 全双工RPC

1. 客户端调用桩模块中的rpc方法，服务端收到通知，带有本次请求的元信息，如方法名或超时时间等
2. 服务端可以选择发回自己的元信息或是等到所有请求数据接受完成再发回
3. 开始数据交互，应用程序自己决定交互方式，即收到全部请求后响应或是边处理变响应
4. 当上传、下载流都关闭后，调用结束

### 超时

你可以指定RPC调用的超时时间，超时的调用会报错。

### 关于调用结果判断

在gRPC中，客户端和服务端对响应结果的判断是独立的。即，如果服务端已经发送了所有响应，他就可以判断本次调用成功；而如果因为网络原因，客户端没有收到所有响应或是响应超时，他也可以判断本次调用失败。所以，依次调用可能有多种状态。

### 取消RPC调用

客户端、服务端都可以随时取消RPC调用。以前的更改不会回退，没做的更改也不会发生。

### 元数据

元数据是某次特定的RPC调用所需的业务无关的数据（如认证、鉴权信息）。元数据以键值对的形式构造，对gRPC透明。

元数据的访问是语言相关的。

### 通道

一个gRPC通道连接桩模块到一个Host上某端口的gRPC服务。客户端可以指定通道参数来修改gRPC的默认行为，如是否启用压缩。

----------------

这就是本篇的全部内容。下一篇中我们将演示gRPC的helloworld demo。
