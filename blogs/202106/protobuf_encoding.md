---
title: Protobuf笔记 - 深入了解protobuf编码机制
date: 2021-6-7
categories:
  - backend
  - famework&libraries
tags:
  - Protobuf
publish: true
---

本文档描述protobuf消息的二进制序列化格式。这不是使用protobuf的必修课程，但是了解这些知识你就知道为什么不同的消息格式会导致序列化消息的体积差异。

## 一个简单的消息结构

假设你有以下消息定义：

```protobuf
message Test1 {
  optional int32 a = 1;
}
```

在应用程序中，你创建了一个Test1类型的message，并且设置a到150。然后你序列化这个消息，你会得到以下字节：

```bytes
08 96 01
```

好吧，一共就只有三个字节。我们接下来解释这些字节的含义。



## Base 128 Varints编码

要理解上面那三个字节是怎样编码的，你首先要理解Varints编码。Varints是一种变长整数编码方案，使用字节作为最小单位。

在Varints编码中，每个字节的最高位称为***most significant bit (msb)***，若msb为1，则表示后面还有更多字节，若msb为0，则当前字节就是最后一个字节。编码时，由低位向高位编码。

例如，使用Varints编码整数1 - 1用1位就可以表示，小于七位，所以只占用一个字节：

```bits
0000 0001
```

这是300，就稍微有点复杂了：

```bits
1010 1100 0000 0010
```

如何解码呢？首先我们去掉msb：

```bits
 010 1100  000 0010
```

由于编码时是由低位向高位编码的，所以翻转这两个七位比特组，连接：

```bits
 000 0010  010 1100
100101100
== 300
```

这就是Varints的编解码过程了。



## 消息结构

protobuf消息就是K-V对的集合。所以二进制版本的消息只是用了每个字段的字段号作为key（字段名是通信双方事先约定的，所以重用字段号会导致错误）。

在解析消息时，解析器会跳过字节流中未知的字段（当然在某些情况下也会保留元信息），这使得拓展字段成为可能。

消息中的K-V对的编码主要分为两个部分：

- wire，一个varints，包含了字段号、值类型
- value bytes，值的编码

### wire

首先给出式子：

```
wire = (field_number << 3) | wire_type
```

其中`field_number`就是字段号，接下来我们来看`wire_type`。

首先引入一个对照表：

| Type | Meaning          | Used For                                                 |
| :--- | :--------------- | :------------------------------------------------------- |
| 0    | Varint           | int32, int64, uint32, uint64, sint32, sint64, bool, enum |
| 1    | 64-bit           | fixed64, sfixed64, double                                |
| 2    | Length-delimited | string, bytes, embedded messages, packed repeated fields |
| 3    | Start group      | groups (deprecated)                                      |
| 4    | End group        | groups (deprecated)                                      |
| 5    | 32-bit           | fixed32, sfixed32, float                                 |

这张表的Type列展示了五种`wire_type`，他用来标记后面value bytes的解析模式。在我们最开始的例子中，`Test1.a`是一个`int32`，所以根据对照表，使用varints编码，`wire_type`为0。

注意，`wire_type`只是wire的一部分。由于五种`wire_type`用三个比特就可以表示，则wire的低三位为`wire_type`。

举个例子，我们计算`Test1.a`的wire：

```
wire = ( 1 << 3 ) | 0
```

其中1是字段号，3是常量，表示左移三位，0表示`wire_type`为varints。再把得到的结果用varints编码：

```bytes
0000 1000
== 0x08
```

就得到了`Test1.a`的wire。

## 更多值类型

### 有符号整数

虽然都是使用varints编码，但是`int32`和`sint32`在处理负数时的表现截然不同。如果你是用`int32`存储负数，编码结果的长度永远是10个字节（因为最高位是1，所以varints的payload永远是64位，ceil(64/7)==10）。而如果使用`sint`，他会使用`ZigZag`编码，就比较高效了。

ZigZag编码有一个公式：

```
(n << 1) ^ (n >> 31)//32b
(n << 1) ^ (n >> 63)//64b
```

看着复杂，其实就是把符号位从最高位移到了最低位。这样varints就能够变长编码负值了。确实是很聪明的做法。

### 定长整数

定长整数（`float`，`fixed32`， `fixed64`, `double`）会根据对应的`wire_type`直接判断长度。

### 字符串/字节流

`wire_type`为2意味着这个字段开始先是一个varint编码的长度整数k，然后紧跟k个字节表示内容。

考虑以下消息结构：

```protobuf
message Test2 {
  optional string b = 2;
}
```

将`Test2.b`设为`"testing"`，你会得到如下序列化结果：

```bytes
12 07 [74 65 73 74 69 6e 67]
```

其中wire=0x12，则字段号为2，wire_type==2

后跟一个varints整数表示字节流长度，0x07表示7个字节

后跟的7个字节是UTF-8字符串，表示“testing”。

## 嵌套消息

也就是说这个字段的类型是其他消息类型。考虑以下消息定义：

```protobuf
message Test3 {
  optional Test1 c = 3;
}
```

为`Test3.c.a`赋值150，编码，得到：

```bytes
 1a 03 08 96 01
```

可以看到后三个字节和Test1的编码一致，0x1a是wire，0x03是字节流长度。

所以string、bytes、嵌套消息可以互转。

## 可选/重复消息

如果使用proto2，字段为repeated，并且没有`[packed=true]`option，编码的消息就会有0或多个字段号相同的字段。这些相同的字段不一定是连续的，可能会穿插别的字段，但顺序是保留的。在proto3中，repeated字段以packed形式编码，我们之后在介绍。

对proto2中的optional字段和proto3中的singular字段，编码的消息可能有0或1个对应的K-V对（官网写的，可是这不是废话么）。

对非重复字段，如果有多个K-V对指向这个字段：

- 对于数值类型和字符串，解析器只会接受最后一个
- 对嵌套消息，解析器融合这些出现的消息。对于出现的冲突，也适用这两条规则。

### packed编码

只有数字类型的重复字段可以被声明为packed，而这在proto3中是默认的。

考虑以下消息定义：

```protobuf
message Test4 {
  repeated int32 d = 4 [packed=true];
}
```

设置d的值为`[3, 270, 86492]`，编码，得到：

```bytes
22        // key (field number 4, wire type 2)
06        // payload size (6 bytes)
03        // first element (varint 3)
8E 02     // second element (varint 270)
9E A7 05  // third element (varint 86942)
```

可见packed编码基本和bytes、string的编码方式一致。

## 关于字段顺序

字段号可以以任意顺序编写，这没有任何影响。protobuf的解析器也不应该以特定顺序解析消息。



---------------

本文介绍了protobuf的编码细节。下一篇我们着重来看它的api。