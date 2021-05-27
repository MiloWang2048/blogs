---
title: 在SpringBoot项目中部署SwaggerUI接口文档
date: 2021-5-27
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
  - SwaggerUI
publish: true
---

## 大纲

本文记录在SpringBoot项目中部署SwaggerUI的详细过程。如果你只是想要使用SwaggerUI来自动生成文档，看这篇文章就足够了。

::: tip

本例中使用Springfox实现的Swagger。它提供了一个starter供快速配置。

Swagger其实是一套机制健全的文档系统，我们这里只是使用了它诸多功能的一小部分。完整的Swagger生态包括了API的定义、文档化、测试流，几乎覆盖了API开发的整个生命周期。我会在后面的博客中详细介绍这些。

:::

> 参考：[Setting Up Swagger 2 with a Spring REST API | Baeldung](https://www.baeldung.com/swagger-2-documentation-for-spring-rest-api)



## 依赖配置

::: warning

请注意下面依赖项的版本，版本不一致可能导致故障。

:::

```xml
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.3.5.RELEASE</version>
		<relativePath/>
	</parent>
	<dependencies>
		<dependency>
			<groupId>io.springfox</groupId>
			<artifactId>springfox-boot-starter</artifactId>
			<version>3.0.0</version>
		</dependency>

		<dependency>
			<groupId>io.springfox</groupId>
			<artifactId>springfox-swagger-ui</artifactId>
			<version>3.0.0</version>
		</dependency>
	</dependencies>
```



## SwaggerConfig配置类

添加一个配置类提供给swagger，这些信息会决定要显示的接口。

```java
@Configuration
public class SwaggerConfig {
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
            // 接口过滤器
                .apis(RequestHandlerSelectors.basePackage("cn.milolab.swaggertest.controller"))
                .paths(PathSelectors.any())
                .build()
            // 静态信息
                .apiInfo(apiInfo());
    }

    private ApiInfo apiInfo() {
        return new ApiInfo(
                "My REST API",
                "Some custom description of API.",
                "0.0.1",
                "Terms of service",
                new Contact("Milo Wang", "github.com/MiloWang2048", "milowang2048@foxmail.com"),
                "MIT", "API license URL", Collections.emptyList());
    }
}
```

运行程序，访问`localhost:8080/swagger-ui/index.html`，就可以看到接口文档了。

![文档页面](https://picgo-1258344804.cos.ap-chongqing.myqcloud.com/20210527184805.png)

