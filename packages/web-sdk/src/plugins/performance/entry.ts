import { MPerformanceNavigationTiming } from '@eagle-tracker/types';

interface PerformanceEntryHandler {
  (entry: PerformanceEntryList): void;
}
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

export const getFP = (): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName('first-paint');
  return entry;
};

export const getFCP = (): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName('first-contentful-paint');
  return entry;
};

// 获取 NT
export const getNavigationTiming = (): MPerformanceNavigationTiming => {
  const resolveNavigationTiming = (entry: PerformanceNavigationTiming):
    MPerformanceNavigationTiming => {
    const {
      domainLookupStart,
      domainLookupEnd,
      connectStart,
      connectEnd,
      secureConnectionStart,
      requestStart,
      responseStart,
      responseEnd,
      domInteractive,
      domContentLoadedEventEnd,
      loadEventStart,
      fetchStart,
    } = entry;

    return {
      TTI: domInteractive - fetchStart,
      Ready: domContentLoadedEventEnd - fetchStart,
      Load: loadEventStart - fetchStart,
      DNS: domainLookupEnd - domainLookupStart,
      TCP: connectEnd - connectStart,
      SSL: secureConnectionStart ? connectEnd - secureConnectionStart : 0,
      TTFB: responseStart - requestStart,
      Trans: responseEnd - responseStart,
      DOM: domInteractive - responseEnd,
      Res: loadEventStart - domContentLoadedEventEnd,
      FirstByte: responseStart - domainLookupStart,
    };
  };

  const navigation = performance.getEntriesByType('navigation').length > 0
    ? performance.getEntriesByType('navigation')[0]
    : performance.timing;
  return resolveNavigationTiming(navigation as PerformanceNavigationTiming);
};
