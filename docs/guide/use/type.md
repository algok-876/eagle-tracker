# TS数据类型
如果你是在TypeScript项目中使用，那么这些类型定义会对你的开发大有益处。  
如果使用的是JavaScript，也可以作为开发参考。

## 使用类型包

```bash
npm i @eagle-tracker/types
```
下列类型全部都可以从此包中导出使用
```typescript
import {
  ITrackerOption, IErrorLog, IJsErrorLog, IHttplog, IPromiseErrorLog, IVueErrorLog,
} from '@eagle-tracker/types';
```

## 错误相关
以下 `xxxLog` 都表示发生对应错误时收集有关这个错误的信息。
### IBasicErrorLog
```typescript
interface IBasicErrorLog {
  /**
  * 页面标题
  */
  title: string
  /**
   * 错误类型
   */
  errorType: 'js-error' | 'promise-error' | 'api-error' | 'vue-error'
  /**
   * 发生错误的时间戳
   */
  timestamp: number
  /**
   * 发生错误页面的路径
   */
  url: string
  /**
   * 捕获到错误的途径
   */
  mechanism: 'onerror' | 'onunhandledrejection' | 'onloadend' | 'vueErrorhandler',
  /**
   * 错误的标识码
   */
  errorUid: string
}
```

### IJsErrorLog
```typescript
interface IJsErrorLog extends IBasicErrorLog {
  /**
   * 发生错误的代码文件
   */
  filename: string
  /**
   * 具体错误信息
   */
  message: string
  /**
   * js错误类型 类似TypeError SyntaxError
   */
  type?: string
  /**
   * 错误堆栈
   */
  stack: StackTrace.StackFrame[],
}
```

### IPromiseErrorLog

```typescript
interface IPromiseErrorLog extends IBasicErrorLog {
  type: string
  /**
   * promise被拒绝的原因
   */
  reason: string
}
```

### IHttpErrorLog
```typescript

interface IHttplog {
  /**
   * 请求方法
   */
  method: string
  /**
   * 请求的url
   */
  url: string | URL
  /**
   * 请求实体
   */
  body: Document | XMLHttpRequestBodyInit | null | undefined | ReadableStream
  /**
   * 发起请求的时间
   */
  requestTime: number
  /**
   * 响应时间
   */
  responseTime: number
  /**
   * http请求状态
   */
  status: number
  /**
   * http请求状态短语
   */
  statusText: string
  /**
   * 响应实体
   */
  response?: any
}

interface IHttpErrorLog extends IBasicErrorLog {
  meta: IHttplog
}
```

### IVueErrorLog
```typescript
interface IVueErrorLog extends IBasicErrorLog {
  message: string,
  componentName?: string
  hook: string
  stack: StackTrace.StackFrame[]
}
```

### IErrorLog
解释：统一各种错误类型，会出现在上报参数和[错误生命周期回调](/guide/use/lifecycle#oncatcherror)中

```typescript
type IErrorLog = IJsErrorLog | IPromiseErrorLog | IHttpErrorLog | IVueErrorLog
```

### ErrorType
这用来表示程序运行中的不同的错误类型  

同样出现在[错误生命周期回调](/guide/use/lifecycle#oncatcherror)中
```typescript
enum ErrorType {
  /**
   * js错误
   */
  JS = 'js-error',
  /**
   * Promise错误
   */
  UJ = 'promise-error',
  /**
   * api错误
   */
  API = 'api-error',
  /**
   * vue错误
   */
  VUE = 'vue-error'
}
```

## 资源加载错误

###  RSErrorType
有多种类型的资源，所以也有多种资源错误类型，例如css加载失败，img加载失败。
```typescript
enum RSErrorType {
  CSS = 'css-load-error',
  IMG = 'img-load-error',
  VIDEO = 'video-load-error',
  AUDIO = 'audio-load-error',
  SCRIPT = 'script-load-error'
}
```

### RSErrorLog
若发生资源加载错误将收集以下的数据。
```typescript
interface RSErrorLog {
  /**
   * 何种类型的资源错误
   */
  type: RSErrorType,
  /**
   * 标签
   */
  tagName: string,
  /**
   * 资源url
   */
  url: string,
  /**
   * 发生错误时间
   */
  triggerTime: number,
  /**
   * 页面url
   */
  pageUrl: string,
  /**
   * 页面标题
   */
  pageTitle: string,
}
```

## 浏览记录
```typescript
interface IPageRecord {
  /**
   * 页面标题
   */
  pageTitle: string
  /**
   * 页面路径
   */
  path: string
  /**
   * 第一次进入页面的时间
   */
  startTime: number
  /**
   * 累计停留的时间
   */
  duration: number
  /**
   * 最后一次离开页面的时间
   */
  endTime: number
}

/**
 * 各页面在线总时长
 */
type UserOnlineRecord = Record<string, IPageRecord>
```

## 性能指标

### PerformanceData
```typescript
interface MPerformanceNavigationTiming {
  FP?: number;
  TTI?: number;
  DomReady?: number;
  Load?: number;
  FirstByte?: number;
  DNS?: number;
  TCP?: number;
  SSL?: number;
  TTFB?: number;
  Trans?: number;
  DomParse?: number;
  Res?: number;
}

interface PerformanceData {
  fp: number,
  fcp: number,
  lcp: number,
  nav: MPerformanceNavigationTiming
}
```

### ResourceItem
```typescript
interface ResourceItem {
  /**
   * 资源名称
   */
  name: string
  /**
   * 资源类型
   */
  type: string
  /**
   * 加载时间
   */
  loadTime: number
  /**
   * 内容下载耗费的时间
   */
  contentDownloadTime: number
  /**
   * 总传输时间
   */
  totalTransTime: number
  /**
   * 资源大小
   */
  size: number
}
```

## 数据上报

### TransportCategory
 上报数据分类
```typescript
export const enum TransportCategory {
  // PV访问数据
  PV = 'pv',
  // 性能数据
  PERF = 'perf',
  // 报错数据
  ERROR = 'error',
  // Vue错误数据
  VUEERROR = 'vue-error',
  // 资源加载错误
  RSERROR = 'resource-load-error',
  // 自定义行为
  CUS = 'custom',
  // 资源加载数据
  RS = 'resource',
  // 用户在浏览过的每个页面的时长
  ONLINE = 'user-page-online'
}
```

### TransportData
待上报的数据
```typescript
type TransportData = IErrorLog
| PerformanceData
| ResourceItem[]
| RSErrorLog
| UserOnlineRecord
```

### TransportStructure
待上报的数据将会被组装成这样的结构
```typescript
interface TransportStructure {
  appId: string,
  /**
   * 应用名称
   */
  appName: string,
  /**
   * 应用版本
   */
  appVersion: string,
  /**
   * 用户id
   */
  uid: string,
  /**
   * 上报数据的类型
   */
  category: TransportCategory
  /**
   * 环境相关数据
   */
  env: {
    /**
     * 浏览器及版本
     */
    browser: string,
    /**
     * 操作系统及版本
     */
    os: string,
    /**
     * 设备类型
     */
    deviceType: 'Mobile' | 'Tablet' | 'Desktop',
    /**
     * 屏幕分辨率
     */
    screen: string,
  }
  /**
   * 上报对象（正文）
   */
  context: TransportData
  /**
   * 上报时间
   */
  timestamp: number
}

```
