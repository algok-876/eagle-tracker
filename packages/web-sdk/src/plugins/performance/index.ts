import {
  TransportCategory,
  PerformanceData,
  ResourceItem,
} from '@eagle-tracker/types';
import MetricsStore, { metricsName, IMetrics } from './store';
import { getFP, getFCP, getNavigationTiming } from './entry';
import { EagleTracker } from '../../../index';
import { getStartName, getEndName, getMeasureName } from './mark';

interface PerformanceEntryHandler {
  (entry: PerformanceEntryList): void;
}

/**
 * 在load事件执行回调
 * @param callback 事件回调
 */
const load = (callback: any) => {
  window.addEventListener('load', callback, {
    once: true,
    capture: true,
  });
};

/**
 * 在load事件之后执行回调
 * @param callback 事件回调
 */
const afterLoad = (callback: any) => {
  if (document.readyState === 'complete') {
    setTimeout(callback);
  } else {
    window.addEventListener('pageshow', callback, { once: true, capture: true });
  }
};

export const observe = (type: string, callback: PerformanceEntryHandler):
  PerformanceObserver | undefined => {
  // 类型合规，就返回 observe
  if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
    const ob: PerformanceObserver = new PerformanceObserver((l) => callback(l.getEntries()));

    ob.observe({ type, buffered: true });
    return ob;
  }
  return undefined;
};

// 初始化入口，外部调用只需要 new WebVitals();
export default class WebVitals {
  // 本地暂存数据在 Map 里 （也可以自己用对象来存储）
  private metrics: MetricsStore;

  private markList: string[] = [];

  private measureList: string[] = [];

  host: EagleTracker;

  /**
   * 收集web性能数据
   * @param host 插件数组
   * @param report 上报回调
   */
  constructor(host: EagleTracker) {
    this.host = host;
    this.metrics = new MetricsStore();

    load(() => {
      this.initLCP();
      this.initFP();
      this.initFCP();
      this.initLCP();
      this.initCLS();
      this.initNavigationTiming();
      if (this.host.configInstance.get('record.performance.resource') === true) {
        this.initResourceFlow();
      }
    });

    afterLoad(() => {
      if (this.host.configInstance.get('record.performance.timing') === false) {
        return;
      }
      const origin = this.metrics.getValues();
      const data: PerformanceData = {
        fp: origin[metricsName.FP],
        fcp: origin[metricsName.FCP],
        lcp: origin[metricsName.LCP],
        nav: origin[metricsName.NT],
      };
      this.host.transportInstance.log(TransportCategory.PERF, data);
    });
  }

  // 初始化 FP 的获取以及返回
  private initFP = (): void => {
    const entry = getFP();
    this.metrics.set(metricsName.FP, entry?.startTime);
  };

  // 初始化 FCP 的获取以及返回
  private initFCP = (): void => {
    const entry = getFCP();
    this.metrics.set(metricsName.FCP, entry?.startTime);
  };

  // 初始化 LCP 的获取以及返回
  private initLCP = (): void => {
    observe('largest-contentful-paint', (entryList) => {
      const entry = entryList[0];
      this.metrics.set(metricsName.LCP, entry.startTime);
    });
  };

  // 初始化 FID 的获取 首次输入延时
  initFID = (): void => {
    observe('first-input', (entryList) => {
      console.log('fid', entryList);
      const entry = entryList[0] as PerformanceEventTiming;
      const delay = entry.processingStart - entry.startTime;
      this.metrics.set(metricsName.FID, {
        delay,
        meta: entry,
      });
    });
  };

  // 初始化 CLS 的获取以及返回
  private initCLS = (): void => {
  };

  // 初始化 NT 的获取以及返回
  private initNavigationTiming = (): void => {
    const navigationTiming = getNavigationTiming();
    const metrics = navigationTiming as IMetrics;
    this.metrics.set(metricsName.NT, metrics);
  };

  // 初始化 RF 的获取以及返回
  private initResourceFlow = (): void => {
    const entry = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const data: ResourceItem[] = entry.map((item) => ({
      name: item.name,
      loadTime: item.duration,
      contentDownloadTime: item.responseEnd - item.responseStart,
      totalTransTime: item.responseEnd - item.requestStart,
      size: item.encodedBodySize,
      type: item.initiatorType,
    }));
    // 资源数据单独上报
    this.host.transportInstance.log(TransportCategory.RS, data, true);
  };

  /**
   * 获取网站性能数据
   * @returns 计算后的数据
   */
  getNavigationTiming() {
    return this.metrics.getValues()[metricsName.NT];
  }

  /**
   * 创建一个性能开始标记
   * @param name 名称
   * @returns 是否成功标记
   */
  markStart(name: string) {
    if (this.markList.includes(getStartName(name))) {
      this.host.console('log', `已存在该开始标记：${name}`, '自定义埋点');
      return false;
    }
    this.markList.push(getStartName(name));
    performance.mark(getStartName(name));
    return true;
  }

  /**
   * 创建一个性能结束标记
   * @param name 名称
   * @returns 是否成功标记
   */
  markEnd(name: string) {
    if (!this.markList.includes(getStartName(name))) {
      this.host.console('log', `不存在对应的开始标记：${name}`, '自定义埋点');
      return false;
    }
    if (this.markList.includes(getEndName(name))) {
      this.host.console('log', `已存在该结束标记：${name}`, '自定义埋点');
      return false;
    }
    this.markList.push(getEndName(name));
    performance.mark(getEndName(name));
    return true;
  }

  /**
   * 创建一个性能测量
   * @param name 名称
   * @returns 是否测量成功
   */
  measure(name: string) {
    const markStartName = getStartName(name);
    const markEndName = getEndName(name);
    if (!this.markList.includes(markStartName)) {
      this.host.console('log', `不存在性能开始标记: ${name}, 无法测量时间`, '自定义埋点');
      return false;
    }
    if (!this.markList.includes(markStartName)) {
      this.host.console('log', `不存在性能结束标记: ${name}，无法测量时间`, '自定义埋点');
      return false;
    }
    if (this.measureList.includes(getMeasureName(name))) {
      this.host.console('log', `已存在该性能测量: ${name}`, '自定义埋点');
      return false;
    }
    this.measureList.push(getMeasureName(name));
    performance.measure(getMeasureName(name), markStartName, markEndName);
    return true;
  }

  /**
   * 获取标记信息，包括开始和结束
   * @param name 标记名称
   * @returns 标记信息数组
   */
  getMarks(name: string) {
    const markStartName = getStartName(name);
    const markEndName = getEndName(name);
    const entrys = performance.getEntriesByType('mark') as PerformanceMark[];
    return entrys.filter((item) => item.name === markStartName || item.name === markEndName);
  }

  /**
   * 删除结束性能标记
   * @param name 标记名称
   */
  clearEndMark(name: string) {
    const index = this.markList.indexOf(getEndName(name));
    if (index < 0) {
      this.host.console('log', `不存在结束性能测量：${name}，无法删除`, '自定义埋点');
      return;
    }
    performance.clearMarks(getEndName(name));
    this.markList.splice(index, 1);
  }

  /**
   * 获取测量的数据
   * @param name 名称
   * @returns 相关数据
   */
  getMeasure(name: string) {
    if (!this.measureList.includes(getMeasureName(name))) {
      this.host.console('log', `不存在性能测量：${name}`, '自定义埋点');
      return [];
    }
    return performance.getEntriesByName(getMeasureName(name)) as PerformanceMeasure[];
  }

  /**
   * 删除已存在的性能测量
   * @param name 测量的名称
   */
  clearMeasure(name: string) {
    const index = this.measureList.indexOf(getMeasureName(name));
    if (index < 0) {
      this.host.console('log', `不存在性能测量：${name}，无法删除`, '自定义埋点');
      return;
    }
    performance.clearMeasures(getMeasureName(name));
    this.measureList.splice(index, 1);
  }

  /**
   * 获取所有测量数据
   * @returns 测量数据
   */
  getAllMeasure() {
    const measures: {
      [prop: string]: PerformanceMeasure
    } = {};
    this.measureList.forEach((name) => {
      const originName = name.split('-')[0];
      measures[originName] = this.getMeasure(originName)[0];
    });
    return measures;
  }
}
