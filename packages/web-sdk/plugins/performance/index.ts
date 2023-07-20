import MetricsStore, { metricsName, IMetrics } from './store';
import { getFP, getFCP, getNavigationTiming } from './entry';
import Eagle from '../../index';
import { TransportCategory, PerformanceData, ResourceItem } from '../../types';

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
  public metrics: MetricsStore;

  host: Eagle;

  /**
   * 收集web性能数据
   * @param host 插件数组
   * @param report 上报回调
   */
  constructor(host: Eagle) {
    this.host = host;
    this.metrics = new MetricsStore();

    load(() => {
      this.initLCP();
      this.initFP();
      this.initFCP();
      this.initLCP();
      this.initCLS();
      this.initFID();
      this.initNavigationTiming();
      this.initResourceFlow();
    });

    afterLoad(() => {
      // 不上报性能数据
      if (!this.host.configInstance.get('record.performance.timing')) {
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

  // 性能数据的上报策略
  perfSendHandler = (): void => {
    // 如果你要监听 FID 数据。你就需要等待 FID 参数捕获完成后进行上报;
    // 如果不需要监听 FID，那么这里你就可以发起上报请求了;
  };

  // 初始化 FP 的获取以及返回
  initFP = (): void => {
    const entry = getFP();
    this.metrics.set(metricsName.FP, entry?.startTime);
  };

  // 初始化 FCP 的获取以及返回
  initFCP = (): void => {
    const entry = getFCP();
    this.metrics.set(metricsName.FCP, entry?.startTime);
  };

  // 初始化 LCP 的获取以及返回
  initLCP = (): void => {
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
  initCLS = (): void => {
  };

  // 初始化 NT 的获取以及返回
  initNavigationTiming = (): void => {
    const navigationTiming = getNavigationTiming();
    const metrics = navigationTiming as IMetrics;
    this.metrics.set(metricsName.NT, metrics);
  };

  // 初始化 RF 的获取以及返回
  initResourceFlow = (): void => {
    // 不上报资源加载情况
    if (!this.host.configInstance.get('record.performance.resource')) {
      return;
    }
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
}
