---
title: CDN工作原理与回源、缓存机制
date: 2021-6-10
categories:
  - backend
  - famework&libraries
tags:
  - Protobuf
publish: true
---

CDN这个东西，就发现虽然天天都在用这玩意，可是一些基本理论还是知之甚少。今天正好没什么活，赶紧补一波。

> 参考[内容分发网络 产品概述 - 产品简介 - 文档中心 - 腾讯云 (tencent.com)](https://cloud.tencent.com/document/product/228/2939)
>
> 吐槽：今天在网上搜了一波，10条搜索结果指向的是同一篇文章……完全复制粘贴那种……

## 工作原理

![图片来自腾讯云](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210610155605.png)

首先假设源站正常运行，部署CDN前：

1. 用户向DNS询问源站地址
2. DNS返回源站地址
3. 用户请求源站
4. 源站返回资源

而部署CDN后：

1. 用户向DNS查询源站地址（这里就牵扯本机的DNS缓存问题）
2. DNS发现已经配置了源站的CNAME解析条目，于是向CDN提供商请求节点调度信息
3. CDN提供商返回最近的接入节点
4. 本地DNS把接入节点地址返回给用户
5. 用户请求接入节点
6. 接入节点检查URL，如果以前缓存了这个资源，并且缓存没有过期，则拦截请求直接返回资源，减少了一次源站访问
7. 如果资源没有被缓存，则relay请求到源站，拿到结果后根据缓存策略设置缓存，并把结果返回给用户，完成一次CDN delivery


## 回源、缓存机制

CDN的缓存、回源机制因不同厂商、不同配置而异，但在默认情况下，如果源站响应头中包含`Cache-Control`，则遵循`Cache-Control`进行缓存：

- 若 Cache-Control 字段为 max-age，CDN 节点缓存资源的时间按照 max-age 值。
- 若 Cache-Control 字段为 no-cache/no-store/private，CDN 节点不缓存资源。

如果没有Cache-Control，则不缓存，每次都回源。

