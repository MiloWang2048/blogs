---
title: Protobuf笔记 - proto语法
date: 2021-6-2
categories:
  - backend
  - famework&libraries
tags:
  - Protobuf
publish: true
---

本文介绍proto文件的语法。如果你还没有完成环境配置，请看我的[上一篇博客](https://blogs.milolab.cn/202105/protobuf_demo.html)。



## proto文件

>参考[Language Guide (proto3)  | Protocol Buffers  | Google Developers](https://developers.google.com/protocol-buffers/docs/proto3)

### 版本标识符

```protobuf
syntax = "proto3";
```

这一句应该出现在所有proto文件的开始，他指定了当前proto文件所使用的版本。目前可用的版本为`proto3`和`proto2`。本文使用`proto3`。

### 消息结构体

```protobuf
message MessageName {
  repeated? type fieldName = field_num;
}
```

使用`message`关键字定义消息结构体，一个消息结构体包含一些字段，在每个字段中：

- repeated表示这个字段可以重复任意次数，通常表示一个数组。
- type表示字段类型，可以是标量（基础类型）、枚举、消息（复合类型）
- field_num表示字段号，在系统上线后不可更改，否则会导致严重的bug。对于经常使用的字段，应该尽量使用1-15之间的值。具体原因会在后续文章中解释。

一个proto文件中可以包含多个消息结构体。

> 注意，proto3中移除了required和optional。现在只有singular和repeated了。

### 注释

proto使用c风格注释。

### 保留字段

```protobuf
message Foo {
  reserved 2, 15, 9 to 11;
  reserved "foo", "bar";
}

enum Bar {
  reserved 2, 15, 9 to 11, 40 to max;
  reserved "FOO", "BAR";
}
```

如果你删除了一个字段，后来的开发者可能会重新使用你之前用过的字段号或字段名。这可能会导致非常严重的错误，所以删除字段时应该使用reserved标记已经删除的字段。在开发者试图使用已经保留的字段名、字段号时，编译器会报错。

### 标量类型

protobuf被设计为尽可能高效率的传输数据，所以很多标量类型都有其自身的使用场景，例如`int32`更适合存储正整数，`fixed32`适合存储大于2^28（四个字节）的整数，`sint32`更适合存储负整数。

> 详细的表格可以在[官方文档](https://developers.google.com/protocol-buffers/docs/proto3#scalar)中查到。

### 默认值

如果入站消息的某些字段未被赋值，则解析默认值。

| 类型     | 默认值         |
| -------- | -------------- |
| string   | 空串           |
| bytes    | 空字节流       |
| bool     | false          |
| 数值     | 0              |
| 枚举     | 第一个定义值   |
| 复合类型 | 具体由语言决定 |
| 列表类型 | 空列表         |

**注意：你不能够在生产环境中判断字段的默认值到底是请求方有意给出的还是根本没有传。所以对默认值做的特殊处理都可能导致潜在的问题。**

### 枚举类型

```protobuf
message MyMessage1 {
  enum EnumAllowingAlias {
    option allow_alias = true;
    UNKNOWN = 0;
    STARTED = 1;
    RUNNING = 1;
  }
}
```

与绝大部分语言中定义的类似，proto文件中也可以定义枚举，并且一般使用整数值表示。

另外，如果你写了`option allow_alias = true;`，此时多个枚举项可以拥有相同的枚举值。在等性判断中，他们的值是相等的。

### 导入

你可以在proto文件中导入其他proto文件的定义：

```protobuf
import "other.proto";
```

但此时如果A引入了B，B引入了C，A可以使用B中的定义，但不能使用C中的定义。如果要在A中引用C，除了添加引用语句之外，也可以在B中使用`import public`语句：

```protobuf
import public "C.proto";
```

这相当于把C中的所有定义搬到了B中。

### 内部类型（Nested Types）

在一个结构中定义一个子结构，引用时用点运算符连接即可：

```protobuf
message SearchResponse {
  message Result {
    string url = 1;
    string title = 2;
    repeated string snippets = 3;
  }
  repeated Result results = 1;
}

message SomeOtherMessage {
  SearchResponse.Result result = 1;
}
```

### 修改消息结构

修改已经运行中的系统的消息结构是一项有风险的行为。但只要遵循以下规则，就不会出问题：

- 不要改变已有字段的字段号
- 只要不重用字段号，字段就可以被安全的删除
- `int32`, `uint32`, `int64`, `uint64`和`bool`本质上是一样的，使用变长整数编码，所以他们之间可以互换（只要你的逻辑还能跑通）。不同的类型之间会被隐式转换（其实就是老的parser不知道新的encoder）。
- `sint32`和`sint64`可以互转
- `string`和`bytes`可以互转（只要bytes是一段合法的UTF-8序列）
- 嵌入类型（非标量类型）的字段可以被成功转换后的`bytes`替换
- `enum`可转换为`int32`, `uint32`, `int64`, `uint64`
- 将一个单值转换为一个**新的**联合类型（`oneof`）的成员是安全的；当你确定你的代码只会设置某些字段一次时，将这些字段转换为一个**新的**联合类型也是安全的。将字段移动到任何现有联合类型都是不安全的。

### 未知字段

在3.5以前，解析器会忽略任何未知的字段。3.5以后引入了和proto2相似的行为：解析器在解析时不会丢弃未知字段，而在序列化时会把他们再写入到字节流中。

### 任意类型（Any）

任意类型允许你存储任意类型的字段，并在运行时进行类型检查。要使用任意类型，需要引入`google/protobuf/any.proto`。

```protobuf
import "google/protobuf/any.proto";

message ErrorStatus {
  string message = 1;
  repeated google.protobuf.Any details = 2;
}
```

protobuf中的Any很像typescript中的Any。具体的运行时类型检查和序列化接口因语言实现不同而异，使用者可以查看对应语言的文档：[API Reference  | Protocol Buffers  | Google Developers](https://developers.google.com/protocol-buffers/docs/reference/overview)。

### 联合类型（Oneof）

```protobuf
message SampleMessage {
  oneof test_oneof {
    string name = 4;
    SubMessage sub_message = 9;
  }
}
```

与c中的union和typescript中的联合类型相似，oneof允许你在一个字段中存储不同类型的值。

- 如果解析器拿到了多个联合字段的值（多种类型）只有最后一个被解析

- `oneof`字段无法被`repeated`修饰

- 反射API也适用于`onof`字段

- 如果你是用c++，请确保你的代码不会访问非法内存。在下面的代码中，由于`sub_message`已经被`set_name()`覆盖了，所以会导致非法内存访问：

  ```cpp
  SampleMessage message;
  SubMessage* sub_message = message.mutable_sub_message();
  message.set_name("name");      // Will delete sub_message
  sub_message->set_...            // Crashes here
  ```

### 映射（Maps）

你可以使用map来表现各类映射结构。格式为：

```protobuf
map<key_type, value_type> map_field = N;
```

在不同的语言中会有不同的表现。但protobuf中的map有些限制：

- `key_type`必须为整数值或字符串，`value_type`可以是除map之外的其他任意值。
- map字段不能被`repeated`修饰
- map中键值的传输顺序是不固定的，你的代码不能依赖这种不确定的顺序。

### package

为了避免名称冲突，可以定义包名：

```protobuf
package foo.bar;
```

在go中，需要指定`option go_package`：

```protobuf
option go_package = "milolab.cn/proto_test/entity";
```

否则protoc会因为找不到正确的引用路径而报错。而在这种情况下，默认的package会失效。所以如果你的项目只是用go，那么可以省略package。

### JSON序列化

一个protobuf message也可以序列化为json。具体行为可以参考[Language Guide (proto3)  | Protocol Buffers  | Google Developers](https://developers.google.com/protocol-buffers/docs/proto3#json)



------------------------

对proto语法的介绍就到这里。下一篇我们来看看protobuf的二进制编码格式。
