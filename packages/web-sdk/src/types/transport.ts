import { TransportCategory } from './enum';
import { IErrorLog } from './tracker';
import { PerformanceData, ResourceItem } from './performance';

/**
 * 上报的数据类型
 */
export type TransportData = IErrorLog | PerformanceData | ResourceItem[]

/**
 * 上报数据的最终形式
 */
export interface TransportStructure {
  pid: string,
  /**
   * 上报数据的类型
   */
  category: TransportCategory
  /**
   * 环境相关数据
   */
  env: any
  /**
   * 上报对象（正文）
   */
  context: TransportData
  /**
   * 上报时间
   */
  timestamp: number
}
