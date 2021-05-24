---
title: 博客搭建日志
date: 2021-5-23
categories:
  - logs
tags:
  - CI/CD
  - vuepress
publish: true
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

1. 每次在主分支上push时进入CI流程
2. 使用`yarn build`构建项目
3. 构建好之后，调用腾讯云的接口将整个站点文件夹上传到存储桶里

于是我们创建Github Action配置文件：

```yml
# .github/workflow/deploy-to-tx-cos.yml
name: Deploy to Tencent COS

# 在主分支提交、PR时启用CI
on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  deploy:
# 在ubuntu-1804环境下运行
    runs-on: ubuntu-18.04
# 为脚本的执行传入环境变量，这些属于隐私信息所以不能直接出现在仓库文件中，而应放在Secrets中统一访问。
    env:
      COS_SECRET_ID: ${{ secrets.COS_SECRET_ID }}
      COS_SECRET_KEY: ${{ secrets.COS_SECRET_KEY }}
      COS_TARGET_BUCKET: ${{ secrets.COS_TARGET_BUCKET }}
      COS_BUCKET_REGION: ${{ secrets.COS_BUCKET_REGION }}
    steps:
# 首先checkout仓库
      - uses: actions/checkout@v2
# 安装依赖并构建
      - name: Build
        run: |
          yarn
          yarn build
# 执行部署脚本，部署到服务器
      - name: Deploy
        run: node deploy.js
```

::: warning
又有一个坑：虽然github Actions的linux执行环境都有免密码的sudo，但是由于sudo相当于切换了用户，所以env中设置的环境变量会失效。如果需要使用env，则尽量不要使用sudo。如果必要，可以尝试手动`sudo -i`+`export ENV`。
:::

这里简单展示一下`deploy.js`的结构，有兴趣的同学可以自行查看[源码](https://github.com/MiloWang2048/blogs/blob/master/deploy.js)：

```js
// deploy.js
async function deleteFiles(files);
async function uploadFiles(relPaths);
async function getAllFilesInBucket();
async function listFilesInPath(dirRelPath);
(async function () {
    const filesToDelete = await getAllFilesInBucket();
    if (filesToDelete.length > 0) {
        await deleteFiles(filesToDelete);
    }
    await uploadFiles(await listFilesInPath(distRelPath));
})()
```

然后我们在github仓库设置页面的secrets标签下创建四个secret，分别代表腾讯云秘钥id、key、目标存储桶和存储桶所在地域：

![设定Secrets](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210524233805.png)

好了！提交并推送，一段时间后网站就已经被部署到了COS上。但是此时还不能访问，需要配置COS存储桶为一个静态网站。

## 静态网站配置

登录腾讯云COS控制台，找到你的存储桶，对基础配置-静态网站作如下配置：

![存储桶基本配置](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210525005815.png)

此时你就可以通过以上显示的域名正常访问了！ohhhhhhhhh！

## 自定义域名、CDN、HTTPS over CDN

我们还想要使用自己的域名访问博客，又要能够使用HTTPS，怎么办呢？有两种解决方案：

- 买一台服务器，用nginx作反向代理
- 使用云平台的CDN over HTTPS，这种方法需要我们申请一个证书。

> [参考链接](https://cloud.tencent.com/document/product/436/11142)

由于学生机IO不行，而我们的博客又全都是静态资源，所以这里采用CDN方式。首先打开域名配置做如下配置：

![这里的域名要填你自己的](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210525010405.png)

然后设置CNAME域名解析：

![域名解析条目，我这个是milolab.cn下的blogs子域](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210525010544.png)

然后去CDN控制台，申请TLS证书：

![申请TLS证书](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210525011001.png)

等待部署完成，就可以使用HTTPS访问了。

![部署完成](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210525011514.png)
