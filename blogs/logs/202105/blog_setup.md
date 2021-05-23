---
title: 博客搭建日志
date: 2021-5-23
categories:
  - logs
tags:
  - CI/CD
  - vuepress
publish: false
---



以前一直觉得Vue的文档页面写的很好看，前两天发现了[VuePress](https://vuepress.vuejs.org/zh/)这个宝藏项目和它的一款非常好看的主题[reco](https://vuepress-theme-reco.recoluan.com/)，于是就有了这个博客网站和这篇文档。

## 描述

这个博客站点的源码托管在github，通过github actions部署到腾讯云的对象存储（github pages国内速度太慢了）。

## 依赖

- [VuePress (vuejs.org)](https://vuepress.vuejs.org/zh/)用作静态站点生成器
- [vuepress-theme-reco (recoluan.com)](https://vuepress-theme-reco.recoluan.com/)一款非常好看的主题！

## 起步

::: tip
如果你没有接触过vuepress，建议先去了解一下它的基本概念，否则可能会遇到一些潜在问题（如Front Matter拓展语法等）。
:::

在**网络环境良好**的情况下，使用vuepress-theme-reco提供的脚手架直接创建一个vuepress项目:

```sh
npx @vuepress-reco/theme-cli init
```

之后脚手架会提示你输入一些项目基本信息：

![outputs](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210523090211.png)

::: warning
这里有个小坑，就是你的项目的title必须符合npm package的name命名规范（因为脚手架会直接给你写进`package.json`），否则后续在使用yarn安装依赖时会报错。
如果输入了不规范的名称（例如含有空格）则可以去修改`package.json`文件里的`name`字段。
:::

项目创建完成后，进入目标目录，安装依赖（这里使用Yarn）。

```sh
cd .\blog-test\
yarn
```

安装完成后，运行

```sh
yarn dev
```

编译完成后，浏览器会自动打开已经生成好的网站。

## 配置

创建项目后，修改一些主要配置：

1. 修改项目根目录下的`README.md`，它会生成我们的站点主页
2. 删去`docs`文件夹，我们不需要
3. 替换`.vuepress\public`下的图标为自己的图标
4. 修改`.vuepress\config.js`配置文件：
   1. `themeConfig.nav`，代表站点顶部的导航栏
   2. `themeConfig.sidbar`，侧边栏表现
   3. `themeConfig.friendLink`，友链
   4. `themeConfig.record`和`themeConfig.startYear`：网站备案信息和开始运营时间
5. 删去`blogs目录下的所有内容`

到此，配置就完成了。创建git仓库并初始化提交、推送到远端，我们准备配置CI流程。

## CI流程

大致的流程是这样的：

1. 每次在主分支上push时，如果commit message不包含`[skip ci]`，则进入CI流程
2. 使用`yarn build`构建项目
3. 构建好之后，调用腾讯云的接口将整个站点文件夹上传到存储桶里
