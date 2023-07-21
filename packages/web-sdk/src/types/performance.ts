export interface MPerformanceNavigationTiming {
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
