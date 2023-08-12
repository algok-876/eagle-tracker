import { TransportCategory } from './enum';
import { IErrorLog, RSErrorLog } from './tracker';
import { MPerformanceNavigationTiming, PerformanceMetric, ResourceItem } from './performance';
import { UserOnlineRecord } from './behavior';

/**
 * 上报的数据类型
 */
export type TransportData = IErrorLog
  | PerformanceMetric
  | ResourceItem[]
  | RSErrorLog
  | UserOnlineRecord
  | MPerformanceNavigationTiming

/**
 * 上报数据的最终形式
 */
export interface TransportStructure {
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
