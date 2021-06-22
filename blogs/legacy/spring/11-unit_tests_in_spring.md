---
title: Spring笔记 - Spring单元测试
categories:
  - backend
  - famework&libraries
tags:
  - SpringBoot
publish: true
---

## 使用步骤

1. 导入spring 单元测试包

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-test</artifactId>
   </dependency>
   ```

2. 编写测试类

   ```java
   // 指定配置文件路径
   @ContextConfiguration(locations = "classpath:ioc.xml")
   // 指定单元测试驱动
   @RunWith(SpringJUnit4ClassRunner.class)
   public class IOCTest {
   
       @Autowired
       Student student;
   
       @Test
       public void testIOC() {
           System.out.println(student);
    }
   }
   ```
   
   