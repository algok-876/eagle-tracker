import { RSErrorType } from './enum';

export interface ErrorStackInfo {
  filename: string,
  functionName: string,
  lineNumber: number,
  columnNumber: number,
}

export type ErrorStackFrames = ErrorStackInfo[]

export interface IBasicErrorLog {
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

export interface IJsErrorLog extends IBasicErrorLog {
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
  stack: ErrorStackFrames,
}

export interface IPromiseErrorLog extends IBasicErrorLog {
  type: string
  /**
   * promise被拒绝的原因
   */
  reason: string
}

export interface RSErrorLog {
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

export interface IHttplog {
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

/**
 * vue错误信息
 */
export interface IVueErrorLog extends IBasicErrorLog {
  message: string
  componentName?: string
  hook: string
  stack: ErrorStackFrames
}

export interface IHttpErrorLog extends IBasicErrorLog {
  meta: IHttplog
}

/** 统一错误信息类型 */
export type IErrorLog = IJsErrorLog | IPromiseErrorLog | IHttpErrorLog | IVueErrorLog

export interface ITrackerOption {
  /**
   * 是否开启错误监控
   */
  enable: boolean
  /**
   * 采样率
   */
  sampling: number
}
