# 错误监控
对于一个监控SDK来说，错误监控是最基本最核心的功能，本节主要阐述各种错误的捕获方式以及相关信息的进一步说明。

## JS运行时错误
未被try...catch块处理的错误会冒泡至window。通过事件error可以捕获到这类错误

收集到的错误信息如下
```json
{
  "title": "Vite App",
  "errorType": "js-error",
  "mechanism": "onerror",
  "message": "jjj is not defined",
  "url": "http://127.0.0.1:4000//",
  "timestamp": 1690961357975,
  "filename": "http://127.0.0.1:4000/main.js?t=1690961349267",
  "stack": [
    {
      "columnNumber": 15,
      "lineNumber": 39,
      "fileName": "http://127.0.0.1:4000/main.js?t=1690961349267",
      "functionName": "b",
    },
    {
      "columnNumber": 3,
      "lineNumber": 36,
      "fileName": "http://127.0.0.1:4000/main.js?t=1690961349267",
      "functionName": "a",
    },
    {
      "columnNumber": 3,
      "lineNumber": 48,
      "fileName": "http://127.0.0.1:4000/main.js?t=1690961349267",
      "functionName": "triggerJSError",
    },
    {
      "columnNumber": 3,
      "lineNumber": 56,
      "fileName": "http://127.0.0.1:4000/main.js?t=1690961349267",
      "functionName": "HTMLButtonElement.<anonymous>",
    }
  ],
  "errorUid": "anMtZXJyb3ItVW5jYXVnaHQlMjBSZWZlcmVuY2VFcnJvciUzQSUyMGpqaiUyMGlzJTIwbm90JTIwZGVmaW5lZC1odHRwJTNBJTJGJTJGMTI3LjAuMC4xJTNBNDAwMCUyRm1haW4uanMlM0Z0JTNEMTY5MDk2MTM0OTI2Nw==",
  "type": "ReferenceError"
}
```
其中stack是错误堆栈，其中第一项是错误所在地。如果你的线上代码是经过混淆和压缩过后的，在服务端去还原错误时需要结合sourcemap。

## Promise被拒绝
Promise 被拒绝（rejected），但没有被合适地处理的情况。这种情况下，unhandledrejection事件会被触发

收集数据示例，详细类型参见 [IPromiseErrorLog](/guide/use/type#ipromiseerrorlog)
```json
{
  "title": "Vite App",
  "errorType": "promise-error",
  "mechanism": "onunhandledrejection",
  "url": "http://127.0.0.1:4000//",
  "timestamp": 1690962483830,
  "type": "unhandledrejection",
  "errorUid": "cHJvbWlzZS1lcnJvci1wcm9taXNlJTIwcmVqJTIwdGVzdA==",
  "reason": "promise rej test"
}
```
reason是promise被拒绝的原因

## HTTP请求错误
一般和服务器交互都会使用XMLHttpRequest对象或者fetch，尽管使用的是axios这样的请求库，底层都是如此。在SDK内部使用
装饰者模式去包装了XMLHttpRequest对象和fetch函数。对于HTTP响应状态码超过400的请求都认为是出错了，会立即上报。

收集的数据示例
```json
{
  "title": "Vite App",
  "errorType": "api-error",
  "mechanism": "onloadend",
  "url": "http://127.0.0.1:4000//",
  "timestamp": 1690963231255,
  "meta": {
    "method": "GET",
    "url": "http://jsonplaceholder.typicode.com/post",
    "requestTime": 1690963230466,
    "status": 404,
    "statusText": "Not Found",
    "response": "{}",
    "responseTime": 1690963231255
  },
  "errorUid": "YXBpLWVycm9yLSU3QiU3RC1Ob3QlMjBGb3VuZC00MDQ="
}
```
其中meta是有关请求与响应的一些信息，详细信息参见 [IHttpErrorLog](/guide/use/type#ihttperrorlog)

## 资源加载错误
css加载错误，script脚本加载错误，图片加载错误，视频加载错误，音频加载错误。都可以被全局error事件监控到，但这类错误
只在捕获阶段触发。

一个图片加载错误示例
```json
{
  "type": "img-load-error",
  "pageUrl": "http://127.0.0.1:4000/",
  "pageTitle": "Vite App",
  "triggerTime": 1690963992374,
  "url": "http://127.0.0.1:4000/baid.com",
  "tagName": "img"
}
```
详细信息参见 [RSErrorLog](/guide/use/type#rserrorlog)


## Vue应用内运行时错误
[errorHandler](https://cn.vuejs.org/api/application.html#app-config-errorhandler) 是Vue提供的为应用内抛出的未捕获错误指定一个全局处理函数。被errorHandler捕获的错误不会冒泡至window，相当于提前处理了。对于Promise来说，只要不是
使用await执行的，还是会被unhandledrejection事件捕获。使用了await就相当于是同步的错误会被errorHandler截胡。

收集的数据示例
```json
{
  "title": "Vite + Vue + TS",
  "errorType": "vue-error",
  "mechanism": "vueErrorhandler",
  "message": "kkk is not defined",
  "url": "http://127.0.0.1:5173//",
  "timestamp": 1690977598534,
  "stack": [
    {
      "filename": "http://127.0.0.1:5173/src/components/HelloWorld.vue?t=1690976932127",
      "functionName": "triggerJSError",
      "lineNumber": 10,
      "columnNumber": 19
    },
    {
      "filename": "http://127.0.0.1:5173/node_modules/.vite/deps/chunk-UWRLCAF5.js?v=54d0d8cf",
      "functionName": "callWithErrorHandling",
      "lineNumber": 1565,
      "columnNumber": 18
    },
    {
      "filename": "http://127.0.0.1:5173/node_modules/.vite/deps/chunk-UWRLCAF5.js?v=54d0d8cf",
      "functionName": "callWithAsyncErrorHandling",
      "lineNumber": 1573,
      "columnNumber": 17
    },
    {
      "filename": "http://127.0.0.1:5173/node_modules/.vite/deps/chunk-UWRLCAF5.js?v=54d0d8cf",
      "functionName": "HTMLButtonElement.invoker",
      "lineNumber": 9397,
      "columnNumber": 5
    }
  ],
  "hook": "native event handler",
  "errorUid": "dnVlLWVycm9yLWtrayUyMGlzJTIwbm90JTIwZGVmaW5lZC1uYXRpdmUlMjBldmVudCUyMGhhbmRsZXI=",
  "componentName": "<HelloWorld>"
}
```
详细信息请参见 [IVueErrorLog](/guide/use/type#ivueerrorlog)
