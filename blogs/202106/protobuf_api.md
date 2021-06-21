---
title: Protobuf笔记 - Protobuf API
date: 2021-6-18
categories:
  - backend
  - famework&libraries
tags:
  - Protobuf
publish: false
---

> 参考链接：[Go Generated Code  | Protocol Buffers  | Google Developers](https://developers.google.com/protocol-buffers/docs/reference/go-generated)

本文解释protobuf生成的Go代码的API。阅读本文章需要一些Protobuf的基本知识。如果你还不知道如何使用Protobuf，请参阅我以前的文章。

## 使用代码生成器

Protobuf的Go代码生成器需要go 1.16以上的开发环境。要安装，运行：

```sh
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
```

这样`protoc-gen-go`就被安装在`$GOBIN`下了。你得确保`$GOBIN`在`$PATH`下以保证`protoc`能够找到它。
