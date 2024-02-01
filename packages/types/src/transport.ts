import { TransportCategory } from './enum';
import { IErrorLog, RSErrorLog } from './tracker';
import { MPerformanceNavigationTiming, PerformanceMetric, ResourceItem } from './performance';
import { UserOnlineRecord } from './behavior';
import { PVData } from './user';

/**
 * 上报的数据类型
 */
export type TransportData = IErrorLog
  | PerformanceMetric
  | ResourceItem[]
  | RSErrorLog
  | UserOnlineRecord
  | MPerformanceNavigationTiming

interface BaseTransportStructure {
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
   * 上报时间
   */
  timestamp: number
}
interface PerStrucutre {
  category: TransportCategory.PERF,
  context: PerformanceMetric
}

interface ErrorStrucutre {
  category: TransportCategory.ERROR,
  context: IErrorLog
}

interface ResStructutre {
  category: TransportCategory.RS,
  context: ResourceItem[]
}

interface RSErrorStructure {
  category: TransportCategory.RSERROR,
  context: RSErrorLog
}

interface OnlineStructure {
  category: TransportCategory.ONLINE,
  context: UserOnlineRecord
}

interface NavStructutre {
  category: TransportCategory.LOAD_SPEED
  context: MPerformanceNavigationTiming
}

interface PVStructutre {
  category: TransportCategory.PV,
  conext: PVData[]
}

export type TransportStructure = BaseTransportStructure &
  (PerStrucutre
    | ErrorStrucutre
    | ResStructutre
    | RSErrorStructure
    | OnlineStructure
    | NavStructutre
    | PVStructutre)
