---
title: js防抖和节流实现笔记
date: 2021-8-1
categories:
  - logs
tags:
  - js
publish: true
---

实现防抖和节流，权当笔记，不一定正确；仅供参考。

## 防抖

防抖，目标是调用一个函数后，延迟一段时间执行；在此期间在调用这个函数会刷新计时器。

防抖的实现中，如何处理this和arguments的透传都会影响到最终输出的代码。以下给出几种实现：

### 写法一：不使用箭头函数，使用call透传this

```js
function makeDebounce(func, timeout) {
  let timer = null;
  return function () {
    const _this = this;
    const _arguments = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      // 没有用箭头函数，所以要手动透传arguments
      timer = null;
      func.call(_this, ..._arguments);
      // 使用call透传this
    }, timeout);
  };
}
```

### 写法二：使用箭头函数

```js
function makeDebounce(func, timeout) {
  let timer = null;
  return function () {
    // 外层必须是function，否则无法透传this
    const _this = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // 用了箭头函数，所以直接使用上层的arguments
      timer = null;
      func.call(_this, ...arguments);
      // 使用call透传this
    }, timeout);
  };
}
```

### 写法三：使用apply透传this

```js
function makeDebounce(func, timeout) {
  let timer = null;
  return function () {
    const _this = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      func.apply(_this, arguments);
      // 不需要使用展开运算符了
    }, timeout);
  };
}
```

### 写法四：使用bind透传this

```js
function makeDebounce(func, timeout) {
  let timer = null;
  return function () {
    const fn = func.bind(this, ...arguments);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      fn();
      // bind之后直接调
    }, timeout);
  };
}
```

### 测试

对上面四种写法，以下测试皆有相同的输出：

```js

const fn = makeDebounce(function () {
  console.log(this);
  console.log(new Date());
  console.log(arguments);
}, 1000);

const a = {
  test: "go",
};

a.fn = fn;

console.log(new Date());
a.fn(1, 2, 3);
a.fn(1, 2, 3);
a.fn(1, 2, 3);
a.fn(1, 2, 3);
console.log(new Date());
```

输出：

```
2021-08-01T02:27:52.093Z
2021-08-01T02:27:52.100Z
{ test: 'go', fn: [Function (anonymous)] }
2021-08-01T02:27:53.105Z
[Arguments] { '0': 1, '1': 2, '2': 3 }
```

## 节流

效果：在一段时间内，只有一次对目标函数的调用是生效的。

### 实现

```js
function makeThrottle(func, timeout) {
  let timer = null;
  return function () {
    const fn = func.bind(this, ...arguments);
    if (timer) {
      return;
    }
    fn();
    timer = setTimeout(() => {
      timer = null;
    }, timeout);
  };
}
```

节流的实现就没那么多讲究了，timer存在时禁止调用，timer结束后可以调就行了。

### 测试

```js
const fn = makeThrottle(function () {
  console.log(this);
  console.log(new Date());
  console.log(arguments);
}, 1000);

const a = {
  test: "go",
};

a.fn = fn;

function exec(timeout) {
  setTimeout(() => {
    a.fn(1, 2, 3);
  }, timeout);
}

console.log(new Date());
exec(500);
exec(1000);
exec(1500);
exec(2000);
console.log(new Date());
```

输出：

```
2021-08-01T02:38:45.564Z
2021-08-01T02:38:45.571Z
{ test: 'go', fn: [Function (anonymous)] }
2021-08-01T02:38:46.085Z
[Arguments] { '0': 1, '1': 2, '2': 3 }
{ test: 'go', fn: [Function (anonymous)] }
2021-08-01T02:38:47.582Z
[Arguments] { '0': 1, '1': 2, '2': 3 }
```

