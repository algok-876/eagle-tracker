# 加载速度

根据W3C规范 [Navigation Timing Level 2](https://w3c.github.io/navigation-timing/) 可以测量出一些关于首次访问速度相关的数据。
![timestamp-diagram](/images/timestamp-diagram.svg)



## 手动获取
这些数据都会在页面被隐藏时自动上报且只上报一次，同样可以手动获取
```typescript
const eagle = new EagleTracker({
  isTest: true,
  appId: 'XXXXXXXX',
  dsn: 'http://test.com/log'
})
const perf = eagle.performance
console.log(perf.getNavigationTiming())
```
数据示例：
```json
{
  "TTI": 78.90000003576279,
  "Ready": 160.10000002384186,
  "Load": 349.30000001192093,
  "DNS": 0,
  "TCP": 0,
  "SSL": 0,
  "TTFB": 1.5999999642372131,
  "Trans": 1.199999988079071,
  "DOM": 69.40000003576279,
  "Res": 189.19999998807907,
  "FirstByte": 8.300000011920929
}
```
具体类型可查看 [MPerformanceNavigationTiming](/guide/use/type#mperformancenavigationtiming-以技术为中心的性能指标-导航加载数据)

## 数据说明
针对数据示例中的每个字段作出解释。

| 上报字段                | 描述                 | 计算公式  | 备注                          |
| ------------------- | -------------------- | ------ | ----------------------------- |
| TTI               | 首次可交互时间               | domInteractive - fetchStart    | 浏览器完成所有HTML解析并且完成DOM构建，此时浏览器开始加载资源。 |
| Ready             | HTML加载完成时间， 即DOM Ready时间。 | domContentLoadEventEnd - fetchStart  | 如果页面有同步执行的JS，则同步JS执行时间=Ready-TTI。|
| Load             | 页面完全加载时间      | loadEventStart - fetchStart | 	Load=首次渲染时间+DOM解析耗时+同步JS执行+资源加载耗时。 |
| DNS             | DNS查询耗时        | 	domainLookupEnd - domainLookupStart  | 无        |
| TCP             | TCP连接耗时     |connectEnd - connectStart | 无        |
| SSL             | SSL安全连接耗时   | 	connectEnd - secureConnectionStart   | 只在HTTPS下有效。          |
| TTFB             | 请求响应耗时               |responseStart - requestStart  | 无           |
| Trans             | 	内容传输耗时     | responseEnd - responseStart  | 无           |
| DOM             | DOM解析耗时     | domInteractive - responseEnd  |无         |
| Res             | 资源加载耗时    | loadEventStart - domContentLoadedEventEnd | 表示页面中的同步加载资源。        |
| FirstByte             | 首包时间               | responseStart - domainLookupStart  | 第一包接收的时间。 |
