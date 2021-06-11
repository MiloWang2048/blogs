---
title: 写一个文件分享系统1 - 需求与设计
date: 2021-6-10
categories:
  - logs
publish: false
---

## 需求定义

版本：0.1

file blast是一套文件分享系统。支持：

- 按路径下载文件
- 可扩展的存储方案
- 管理员可以授权用户进行：
  - 列出
  - 下载
  - 上传
  - 删除
  - 移动
- 支持批量下载
- 支持常见文件类型预览：jpg，png，gif，mp3，wav，pdf，mp4，mkv
- 可以搜索文件名/目录名

## 设计

### 解决方案

- 本系统为BS结构，前后端分离。
- 前端是一个Vue静态网站：
  - 使用Vuetify组件库
  - 部署在Nginx容器上
  - 同时这个Nginx容器作为SSL网关反向代理后端容器
- 后端是一个SpringBoot REST项目：
  - 使用sa-token认证、鉴权
  - 使用mybatis plus作ORM
  - 部署在一个Java容器上
- 使用mysql作主数据库
- 使用docker-compose部署

### 数据库结构

当前版本数据库仅存储用户认证鉴权相关信息，所以结构比较简单：

![就这么两个表](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210611163140.png)



### 后端结构

#### REST API

标准返回结构：

```json
{
    "err": null,
    "msg": "ok",
    "data": {}
}
```

接口列表：

- login
- logout
- 

