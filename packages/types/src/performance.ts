export interface MPerformanceNavigationTiming {
  /**
   * 首次可交互时间
   */
  firstInteractive?: number;
  /**
   * 解析完dom所花费的时间
   */
  domReady?: number;
  /**
   * 页面完全加载时间
   */
  load?: number;
  /**
   * DNS查询耗费的时间
   */
  dns?: number;
  /**
   * 建立tcp连接所花费的时间
   */
  tcp?: number;
  /**
   * SSL安全连接耗时
   */
  ssl?: number;
  /**
   * 请求响应耗时
   */
  http?: number;
  /**
   * 响应内容传输耗时
   */
  trans?: number;
  /**
   * dom解析耗时
   */
  domParse?: number;
  /**
   * 资源加载耗时
   */
  resource?: number;
}

export interface PerformanceData {
  fp: number,
  fcp: number,
  lcp: number,
  nav: MPerformanceNavigationTiming
}

export interface ResourceItem {
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
