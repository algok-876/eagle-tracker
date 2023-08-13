import {
  TransportCategory,
  ResourceItem,
  LayoutShift,
} from '@eagle-tracker/types';
import MetricsStore, { metricsName } from './store';
import {
  getNavigationTiming,
} from './entry';
import { EagleTracker } from '../../../index';
import { getStartName, getEndName, getMeasureName } from './mark';
import { observe } from '../../lib/observe';
import { whenActivated } from '../../lib/whenActivated';
import { onHidden } from '../../lib/onHidden';
import { runOnce } from '../../lib/runOnce';
import { initMetric } from '../../lib/initMetric';
import { getRating } from '../../lib/getRating';
import { onBFCacheRestore } from '../../lib/bfcache';

export default class WebVitals {
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
    whenActivated(() => {
      this.initLCP();
      this.initFP();
      this.initFCP();
      this.initLCP();
      this.initCLS();
      this.initFID();
    });

    // 上报以用户为中心的性能指标
    onHidden(() => {
      this.host.transportInstance.log(TransportCategory.PERF, this.getVitals());
    });
    // 上报以技术为中心的性能指标, 只上报一次
    onHidden(runOnce(() => {
      const data = getNavigationTiming();
      this.host.transportInstance.log(TransportCategory.LOAD_SPEED, data);
    }));
    // 上报资源加载数据，只上报一次
    onHidden(runOnce(this.reportResourceFlow));
  }

  // 初始化 FP 的获取以及返回
  private initFP = (): void => {
    const [entry] = performance.getEntriesByName('first-paint');
    if (entry) {
      const metric = initMetric('FP');
      metric.value = entry.startTime;
      metric.entries.push(entry);
      metric.rating = getRating(metric.value, [1000, 2000]);
      this.metrics.set(metricsName.FP, metric);
    }
  };

  // 初始化 FCP 的获取以及返回
  private initFCP = (): void => {
    const [entry] = performance.getEntriesByName('first-contentful-paint');
    if (entry) {
      const metric = initMetric('FCP');
      metric.value = entry.startTime;
      metric.entries.push(entry);
      metric.rating = getRating(metric.value, [1000, 2000]);
      this.metrics.set(metricsName.FCP, metric);
    }
  };

  // 初始化 LCP 的获取以及返回
  private initLCP = (): void => {
    this.metrics.set(metricsName.LCP, initMetric('LCP'));
    observe('largest-contentful-paint', (entryList) => {
      const entry = entryList[entryList.length - 1];
      const metric = this.metrics.get(metricsName.LCP);
      if (metric) {
        metric.value = entry.startTime;
        metric.entries.push(entry);
        metric.rating = getRating(metric.value, [2.5 * 1000, 4 * 1000]);
      }
    });
  };

  // 初始化 FID 的获取 首次输入延时
  private initFID = (): void => {
    this.metrics.set(metricsName.FID, initMetric('FID'));
    observe('first-input', (entryList) => {
      const metric = this.metrics.get(metricsName.FID);
      const entry = entryList[0] as PerformanceEventTiming;
      const delay = entry.processingStart - entry.startTime;
      if (metric) {
        metric.value = delay;
        metric.entries.push(entry);
        metric.rating = getRating(metric.value, [100, 200]);
      }
    });
  };

  // 初始化 CLS 的获取以及返回
  private initCLS = (): void => {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: LayoutShift[] = [];
    this.metrics.set(metricsName.CLS, initMetric('CLS'));
    observe('layout-shift', (entryList) => {
      const metric = this.metrics.get(metricsName.CLS);
      entryList.forEach((item) => {
        const entry = item as LayoutShift;
        // 只将不带有最近用户输入标志的布局偏移计算在内。
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          // 如果条目与上一条目的相隔时间小于 1 秒且
          // 与会话中第一个条目的相隔时间小于 5 秒，那么将条目
          // 包含在当前会话中。否则，开始一个新会话。
          if (sessionValue
            && entry.startTime - lastSessionEntry.startTime < 1000
            && entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          // 如果当前会话值大于当前 CLS 值，
          // 那么更新 CLS 及其相关条目。
          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            if (metric) {
              metric.value = sessionValue;
              metric.entries = sessionEntries;
              metric.rating = getRating(metric.value, [0.1, 0.25]);
            }
          }
        }
      });
    });
    // 当页面从往返缓存中恢复时需要重置CLS
    onBFCacheRestore(() => {
      this.metrics.set(metricsName.CLS, initMetric('CLS'));
      clsValue = 0;
      sessionValue = 0;
      sessionEntries.length = 0;
    });
  };

  // 初始化 RF 的获取以及返回
  private reportResourceFlow = (): void => {
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
   * 获取网站导航加载性能数据
   * @returns 计算后的数据
  */
  getNavigationTiming() {
    return getNavigationTiming();
  }

  /**
   * 获取以用户为中心的性能指标
   */
  getVitals() {
    const origin = this.metrics.getValues();
    return {
      FP: origin[metricsName.FP],
      FCP: origin[metricsName.FCP],
      LCP: origin[metricsName.LCP],
      CLS: origin[metricsName.CLS],
      FID: origin[metricsName.FID],
    };
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
