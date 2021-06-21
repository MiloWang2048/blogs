---
title: .NET中的依赖注入
date: 2021-6-18
categories:
  - famework&libraries
tags:
  - .NET
publish: true
---

在Java中，没有原生的IOC支持，我们日常使用IOC基本都是通过Spring Framework提供的特性。但在.NET中，DI是“一等公民”（官网原话），由.NET运行时库提供，是一个非常底层的东西。由此看出，C# .NET生态还是有非常多先进的设计在内的。

>  参考链接[.NET 中的依赖关系注入 | Microsoft Docs](https://docs.microsoft.com/zh-cn/dotnet/core/extensions/dependency-injection)

## .NET中DI的实现方式

.NET通过以下方式实现DI：

- 使用接口或基类将依赖关系实现抽象化。
- 在服务容器中注册依赖关系。 .NET 提供了一个内置的服务容器 [IServiceProvider](https://docs.microsoft.com/zh-cn/dotnet/api/system.iserviceprovider)。 服务通常在应用启动时注册，并追加到 [IServiceCollection](https://docs.microsoft.com/zh-cn/dotnet/api/microsoft.extensions.dependencyinjection.iservicecollection)。 添加所有服务后，可以使用 [BuildServiceProvider](https://docs.microsoft.com/zh-cn/dotnet/api/microsoft.extensions.dependencyinjection.servicecollectioncontainerbuilderextensions.buildserviceprovider) 创建服务容器。
- 将服务注入到使用它的类的构造函数中。 框架负责创建依赖关系的实例，并在不再需要时将其释放。

由此看出和Spring的以下几点不同：

- 需要对依赖进行抽象化描述
- 依赖注入只能通过构造函数实现

例如，我们有一个“帽子”服务：

```c#
using System;

namespace DependencyInjection.Example
{
    public interface IHat
    {
        void Wear();
    }
    
    public class Hat : IHat
    {
        public void Wear()
        {
            Console.WriteLine("I weared a hat!");
        }
    }
}
```

注册该服务：

::: warning
这里有坑！如果使用原生.NET控制台应用程序框架，编译器会提示`Host`不存在。这是因为我们虽然引用了`Microsoft.Extensions.Hosting`名称空间，但是`Host`是在一个NuGet包中定义的。我们需要在NuGet中手动安装`microsoft.extensions.hosting`这个包（虽然看起来多此一举，但是是必要的）。
:::

> 关于Host的更多信息，参阅[.NET 通用主机 | Microsoft Docs](https://docs.microsoft.com/zh-cn/dotnet/core/extensions/generic-host)

```c#
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace DependencyInjection.Example
{
    class Program
    {
        static Task Main(string[] args) =>
            CreateHostBuilder(args).Build().RunAsync();

        static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((_, services) =>
                    services.AddHostedService<Worker>()// Consumer
                            .AddScoped<IHat, Hat>());// Provider
    }
}
```

在需要时引用依赖：

```c#
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;

namespace DependencyInjection.Example
{
    public class Worker : BackgroundService
    {
        private readonly IHat _hat;

        public Worker(IHat hat) =>
            _hat = hat;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                _hat.Wear();
                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
```

此时我们运行程序，会发现这个工人每秒钟戴一次帽子。

![](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210618111950.png)

## 服务生命周期

在.NET DI系统中，服务有三种生命周期：

- Scoped：服务在Scope开始时创建，在Scope结束时销毁。在Web环境下，Scope表现为每一次连接会话；在其他环境则可以自行配置。
- Transient：在每次需要服务时创建一个服务实例
- Singleton：首次请求时创建服务，被多个Consumer公用。此时服务必须是线程安全的。



