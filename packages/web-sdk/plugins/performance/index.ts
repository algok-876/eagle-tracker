import MetricsStore, { metricsName, IMetrics } from './store';
import { getFP, getFCP, getNavigationTiming } from './entry';
import Eagle from '../../index';

export interface PerformanceEntryHandler {
  (entry: PerformanceEntryList): void;
}

export const afterLoad = (callback: any) => {
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

  constructor(host: Eagle, report: (data: any) => void) {
    this.host = host;
    this.metrics = new MetricsStore();
    afterLoad(() => {
      this.initLCP();
      this.initFP();
      this.initFCP();
      this.initLCP();
      this.initCLS();
      this.initFID();
      this.initNavigationTiming();
      this.initResourceFlow();
      setTimeout(() => {
        report(this.metrics.getValues());
      }, 2000);
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
    const metrics = {
      startTime: entry?.startTime.toFixed(2),
      entry,
    } as IMetrics;

    this.metrics.set(metricsName.FP, metrics);
  };

  // 初始化 FCP 的获取以及返回
  initFCP = (): void => {
    const entry = getFCP();
    const metrics = {
      startTime: entry?.startTime.toFixed(2),
      entry,
    } as IMetrics;

    this.metrics.set(metricsName.FCP, metrics);
  };

  // 初始化 LCP 的获取以及返回
  initLCP = (): void => {
    observe('largest-contentful-paint', (entryList) => {
      const entry = entryList[0];
      const metrics = {
        startTime: entry?.startTime.toFixed(2),
        entry,
      } as IMetrics;
      this.metrics.set(metricsName.LCP, metrics);
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
        entry,
      });
    });
  };

  // 初始化 CLS 的获取以及返回
  initCLS = (): void => {
    // ... 详情代码在下文
  };

  // 初始化 NT 的获取以及返回
  initNavigationTiming = (): void => {
    // ... 详情代码在下文
    const navigationTiming = getNavigationTiming();
    const metrics = navigationTiming as IMetrics;
    this.metrics.set(metricsName.NT, metrics);
  };

  // 初始化 RF 的获取以及返回
  initResourceFlow = (): void => {
    // ... 详情代码在下文
  };
}
