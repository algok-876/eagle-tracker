import { cloneDeep } from '@eagle-tracker/utils';
import { EagleTracker } from '../../../index';
import { TransportCategory } from '../../types/enum';
import wrapReplaceHistory from './event';
import { IPageRecord, UserOnlineRecord } from '../../types/behavior';
import groupBy from './group';

export default class Behavior {
  private host: EagleTracker;

  private pageTimeList: IPageRecord[];

  constructor(host: EagleTracker) {
    this.host = host;
    this.pageTimeList = [];

    // 是否需要记录用户在线时长
    if (this.host.configInstance.get('record.timeOnPage') === true) {
      // 包装原始pushState replareState方法，目的是监听这两个函数触发
      wrapReplaceHistory();
      // 监控用户页面在线时长
      this.mintorTimeOnPage();
    }
  }

  /**
   * 记录最后一个记录的离开时间和持续时间
   */
  private overLastRecord() {
    const lastRecord = this.pageTimeList[this.pageTimeList.length - 1];
    const now = Date.now();
    lastRecord.endTime = now;
    lastRecord.duration = now - lastRecord.startTime;
  }

  /**
   * 向记录推入一条新的停留记录
   */
  private pushNextPage() {
    const now = Date.now();
    this.pageTimeList.push({
      pageTitle: document.title,
      path: window.location.pathname,
      startTime: now,
      endTime: 0,
      duration: 0,
    });
  }

  /**
   * 补充最后一个记录并推入新的页面记录
   */
  private recordNextPage() {
    // 无记录时不需要补充
    if (this.pageTimeList.length > 0) {
      const lastRecord = this.pageTimeList[this.pageTimeList.length - 1];
      // 当前path与最后一次记录的path相同时，既不记录又不推入新记录
      // 主要是防止一次路由跳转时多次触发此函数
      // 例如vue-router跳转时会同时调用replaceState和pushState
      if (lastRecord.path === window.location.pathname) {
        return;
      }
      this.overLastRecord();
    }
    this.pushNextPage();
  }

  private mintorTimeOnPage() {
    window.addEventListener('load', () => {
      this.recordNextPage();
    });

    // 单页面应用调用pushState时触发
    window.addEventListener('pushState', () => {
      this.recordNextPage();
    });

    // 单页面应用调用pushState时触发
    window.addEventListener('replaceState', () => {
      this.recordNextPage();
    });

    // 单页面应用调用history.back(),history.forward,history.go
    // 或者用户直接操作浏览器后退前进按钮时触发
    window.addEventListener('popstate', () => {
      this.recordNextPage();
    });

    // 监听页面的可见性
    // 不可见时上报数据，并清空列表
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.overLastRecord();
        // 将重复页面的记录进行分组
        const group = groupBy(this.pageTimeList, 'path');
        // 分组后累加停留时长
        const simapleList: UserOnlineRecord = {};
        Object.keys(group).forEach((key) => {
          simapleList[key] = group[key].reduce((prev, curr) => ({
            pageTitle: curr.pageTitle,
            path: key,
            startTime: Math.min(prev.startTime, curr.startTime),
            endTime: Math.max(prev.endTime, curr.endTime),
            duration: prev.duration + curr.duration,
          }));
        });
        this.host.transportInstance.log(TransportCategory.ONLINE, simapleList);
        this.pageTimeList.length = 0;
      } else if (document.visibilityState === 'visible') {
        // 可见时重新开始记录
        this.recordNextPage();
      }
    });
  }

  getPageRecord() {
    return cloneDeep(this.pageTimeList);
  }
}
