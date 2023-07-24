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
   * api错误
   */
  API = 'api-error',
  /**
   * vue错误
   */
  VUE = 'vue-error'
}

export const enum TransportCategory {
  // PV访问数据
  PV = 'pv',
  // 性能数据
  PERF = 'perf',
  // 报错数据
  ERROR = 'error',
  // Vue错误数据
  VUEERROR = 'vue-error',
  // 自定义行为
  CUS = 'custom',
  // 资源加载数据
  RS = 'resource'
}
