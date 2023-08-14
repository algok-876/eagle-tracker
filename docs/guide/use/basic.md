# 基础说明

## 自动运行
sdk会全程自动运行，理论上不需要手动干预，也暂不支持手动采集。如果你希望改变数据结构，或者手动上报数据，请异步至[手动上报](/guide/use/manual)

```javascript
const eagle = new EagleTracker({
  isTest: true,
  appId: 'XXXXXXXX',
  dsn: 'http://test.com/log'
})
```
运行上述代码发生了：
- 初始化JS、Promise、Http请求错误、Vue错误监听
- 初始化资源加载错误监听
- 初始化统计页面在线时长
- 页面加载完成后开始收集性能指标
- 页面加载完毕后开始收集资源加载情况

## 环境相关数据
在数据上报之前会附带一些公共数据，其中就包含与用户环境相关的数据。例如用户所使用的浏览器类型及版本，操作系统类型及版本，屏幕分辨率。

至于用户IP和所在位置或者地理相关信息，单靠SDK很难做到，这个需要借助后端来实现。
### 数据样例

```json
{
  "browser": "Chrome 117.0.0.0",
  "deviceType": "Desktop",
  "os": "Windows 10.0",
  "screen": "1536x864",
}
```

### 手动获取
当然也可以手动获取这些数据

```javascript
eagle.getUserEnv()
```

## 数据上报

### 上报方式
目前的上报方式只有图片上报，即动态地创建图片元素，然后数据作为[dsn](/guide/use/options#main-主要配置)的URL参数附加在图片的src属性中，相当于发送一次GET请求，它有如下好处
- 跨域支持，图片上报是一种跨域的数据上报方式。由于浏览器的同源策略限制，普通的AJAX请求无法跨域发送数据到其他域名。
- 无需服务器端支持，图片上报不需要服务器端的特殊支持，因为它只是通过URL参数传递数据，服务器端只需要解析URL即可获取数据。
- 减小心智负担，无需处理请求失败的情况

### 上报时机
上报时机分为 立即上报 和页面隐藏时上报
#### 立即上报
应用内发生错误是一般无特殊说明都采取立即上报。
#### 页面卸载时上报
页面卸载可以分为以下三种情况
- 页面可见时，用户关闭 Tab 页或浏览器窗口
- 页面可见时，用户在当前窗口前往另一个页面
- 页面不可见时，用户或系统关闭浏览器窗口

这三种情况 [visibilitychange](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/visibilitychange_event)
都会触发。`pagehide`，`beforeunload`，`unload` 事件在移动端可能不会触发，就关闭页面了，因为移动端可以直接
将浏览器进程切入后台，然后直接杀死进程。相比之下，`visibilitychange`事件更可靠。

另外，如果指定了 `beforeunload`，`unload` 事件会阻止浏览器将页面加入[bfcache](https://web.dev/bfcache/)中

```typescript
const onHidden = (cb: OnHiddenCallback) => {
  const onHiddenOrPageHide = (event: Event) => {
    if (event.type === 'pagehide' || document.visibilityState === 'hidden') {
      cb(event);
    }
  };
  window.addEventListener('visibilitychange', onHiddenOrPageHide, true);
  // 有些浏览器不支持visibilitychange
  window.addEventListener('pagehide', onHiddenOrPageHide, true);
};
```
防止有些浏览器不支持 `visibilitychange` 事件，需要`pagehide`事件兜底。

### 数据处理
最终发送的数据经过`JSON.stringify`序列化之后，会再使用`encodeURIComponent`对字符串中的特殊字符进行转义，这样做的目的是
避免上报的数据破坏URI的结构和含义，能够正确地被传输。