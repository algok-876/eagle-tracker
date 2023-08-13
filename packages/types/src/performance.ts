/**
 * 以技术为中心的性能指标
 */
export interface MPerformanceNavigationTiming {
  /**
   * 首次可交互时间
   */
  TTI: number;
  /**
   * 解析完dom所花费的时间
   */
  Ready: number;
  /**
   * 页面完全加载时间
   */
  Load: number;
  /**
   * DNS查询耗费的时间
   */
  DNS: number;
  /**
   * TCP连接耗时
   */
  TCP: number;
  /**
   * 首包时间
   */
  FirstByte: number;
  /**
   * 请求响应耗时
   */
  TTFB: number;
  /**
   * 响应内容传输耗时
   */
  Trans: number;
  /**
   * dom解析耗时
   */
  DOM: number;
  /**
   * SSL安全连接耗时
   */
  SSL: number;
  /**
   * 资源加载耗时
   */
  Res: number;
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

export interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export interface Metric {
  /**
   * The name of the metric (in acronym form).
   */
  name: 'CLS' | 'FID' | 'LCP' | 'FCP' | 'FP';

  /**
   * 性能度量值
   */
  value: number;

  /**
   * 性能值的评级
   */
  rating: 'good' | 'needs-improvement' | 'poor';

  /**
   * 和数据统计相关的原始性能条目
   */
  entries: (
    | PerformanceEntry
    | LayoutShift
  )[];
}

/**
 * 以用户为中心的性能指标
 */
export interface PerformanceMetric {
  FP: Metric,
  FCP: Metric,
  LCP: Metric,
  FID: Metric,
  CLS: Metric,
}
