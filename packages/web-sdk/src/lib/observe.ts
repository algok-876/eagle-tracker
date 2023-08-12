import { LayoutShift } from '@eagle-tracker/types';

interface PerformanceEntryMap {
  'event': PerformanceEventTiming[];
  'paint': PerformancePaintTiming[];
  'layout-shift': LayoutShift[];
  'largest-contentful-paint': PerformancePaintTiming[];
  'first-input': PerformanceEventTiming[];
  'navigation': PerformanceNavigationTiming[];
  'resource': PerformanceResourceTiming[];
}

/**
 * 创建一个PerformanceObserver实例并返回
 */
export const observe = <K extends keyof PerformanceEntryMap>(type: K,
  callback: (entries: PerformanceEntryMap[K]) => void,
  opts?: PerformanceObserverInit,
): PerformanceObserver | undefined => {
  try {
    if (PerformanceObserver.supportedEntryTypes.includes(type)) {
      const po = new PerformanceObserver((list) => {
        callback(list.getEntries() as PerformanceEntryMap[K]);
      });
      po.observe({
        type,
        buffered: false,
        ...opts || {},
      });
      return po;
    }
  } catch (e) { }
  return undefined;
};
