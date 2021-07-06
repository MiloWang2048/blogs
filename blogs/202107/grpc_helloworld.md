---
title: gRPC - Helloworld
date: 2021-7-1
categories:
  - backend
  - famework&libraries
tags:
  - gRPC
publish: true
---

本节展示一个最简的gRPC Helloworld，使用go实现，主要是进行环境相关配置。

在此之前，请确保你已经正确安装了protobuf的编译器protoc，以及用于生成go代码的代码生成器插件。如果你还没有安装，可以参考我的[另一篇博客](https://blogs.milolab.cn/202105/protobuf_demo.html)

> 参考链接：
>
> [Quick start | Go | gRPC](https://grpc.io/docs/languages/go/quickstart/)

## 项目初始化

首先安装gRPC的代码生成器（保证你的`GOPATH/bin`在`PATH`中）：

```powershell
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.1
```

在`GOPATH/src`下创建项目，本例为`GOPATH/src/milolab.cn/grpc_test`

```powershell
mkdir $env:GOPATH/src/milolab.cn/grpc_test
cd $env:GOPATH/src/milolab.cn/grpc_test
go mod init
```

## 定义消息类型和rpc服务

在项目下新建目录`entity`，创建文件`Hello.proto`，写入如下内容：

```protobuf
syntax = "proto3";

// go引用路径
option go_package = "milolab.cn/grpc_test/entity";

// rpc服务定义
service Greeter {
	// 这个名为SayHello的方法接受一个HelloRequest，返回一个HelloReply，是一个简单rpc
    rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// 请求结构
message HelloRequest {
    string name = 1;
}

// 响应结构
message HelloReply {
    string message = 1;
}
```

生成go代码：

```powershell
protoc --go_out=$env:GOPATH/src --go-grpc_out=$env:GOPATH/src entity/*.proto
```

然后你就会看到entity目录下多出了两个文件，分别代表消息类型定义和rpc服务定义：

![](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210706092126.png)

然后安装所需依赖：

```powershell
go mod tidy
```

我们的定义部分就完成了。

## 实现服务端

我们查看`entity/Hello_grpc.pb.go`，可以看到如下定义：

```go
// GreeterServer is the server API for Greeter service.
// All implementations must embed UnimplementedGreeterServer
// for forward compatibility
type GreeterServer interface {
	SayHello(context.Context, *HelloRequest) (*HelloReply, error)
	mustEmbedUnimplementedGreeterServer()
}

// UnimplementedGreeterServer must be embedded to have forward compatible implementations.
type UnimplementedGreeterServer struct {
}
```

这是gRPC自动生成的代码，对应我们在`proto`中定义的GreeterServer。在go中，实现这一接口需要在内部嵌入一个`UnimplementedGreeterServer`来保证后向兼容性。

创建`Server.go`，写入以下内容：

```go
package main

import (
	"context"
	"log"
	"milolab.cn/grpc_test/entity"
)

// 定义server
type server struct {
    // 嵌入UnimplementedGreeterServer
	entity.UnimplementedGreeterServer
}

// 实现entity.GreeterServer
func (s *server) SayHello(ctx context.Context, req *entity.HelloRequest) (*entity.HelloReply, error) {
    // 打印收到的消息并返回结果
	log.Printf("Received: %v", req.GetName())
	return &entity.HelloReply{Message: "Hello " + req.GetName()}, nil
}
```

然后实现`main()`来启动服务器：

```go
func main() {
   listener, _ := net.Listen("tcp", "localhost:8080")
   s := grpc.NewServer()
   entity.RegisterGreeterServer(s, &server{})
   _ = s.Serve(listener)
}
```

此时如果启动成功，服务将在8080上开始监听。

## 实现客户端

我们找到客户端的定义：

```go
// GreeterClient is the client API for Greeter service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type GreeterClient interface {
	SayHello(ctx context.Context, in *HelloRequest, opts ...grpc.CallOption) (*HelloReply, error)
}

type greeterClient struct {
	cc grpc.ClientConnInterface
}

func NewGreeterClient(cc grpc.ClientConnInterface) GreeterClient {
	return &greeterClient{cc}
}
```

我们可以使用导出的`NewGreeterClient`函数来创建客户端。

创建`Client.go`，写入以下内容：

```go
package main

import (
	"context"
	"fmt"
	"google.golang.org/grpc"
	"log"
	"milolab.cn/grpc_test/entity"
	"time"
)

func main() {
	// 建立连接
	conn, _ := grpc.Dial("localhost:8080", grpc.WithInsecure(), grpc.WithBlock())
	defer conn.Close()
    
    // 创建客户端
	client := entity.NewGreeterClient(conn)
    
    // 设置超时时间
	ctx, cancel := context.WithTimeout(context.Background(), 30 * time.Second)
	defer cancel()

	// 读取用户输入，发起RPC调用
	name := ""
	for {
		_, _ = fmt.Scanf("%s\n", &name)
		if name == "exit"{
			break
		}
		response, _ := client.SayHello(ctx, &entity.HelloRequest{Name: name})
        // 打印结果
		log.Printf("Greeting: %s", response.GetMessage())
	}
}
```

## 测试

在一个终端中，运行服务端：

```
go run .\Server.go
```

在另一个终端中，运行客户端：

```
go run .\Client.go
```

在客户端的终端输入消息，可以看到客户端打印了来自服务端的响应，和服务端的本地log：

![](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210706104432.png)



------

完成。下一篇我们详细介绍gRPC的API。
