export interface IPageRecord {
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
export type UserOnlineRecord = Record<string, IPageRecord>
