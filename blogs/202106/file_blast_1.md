---
title: 写一个文件分享系统1 - 需求与设计
date: 2021-6-10
categories:
  - logs
publish: false
---

## 需求定义

版本：1.0

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
- 支持已知文件预览
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
- 使用mysql作主数据库，redis作缓存中间件
- 使用docker-compose部署

### 系统领域划分

