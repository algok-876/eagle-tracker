/**
 * 上报数据种类
 */
export const enum ErrorType {
  /**
   * js错误
   */
  JS = 'js-error',
  /**
   * Promise错误
   */
  UJ = 'promise-error',
  /**
   * 性能相关数据
   */
  API = 'api-error'
}

export const enum TransportCategory {
  // PV访问数据
  PV = 'pv',
  // 性能数据
  PERF = 'perf',
  // 报错数据
  ERROR = 'error',
  // 自定义行为
  CUS = 'custom',
  RS = 'resource'
}
