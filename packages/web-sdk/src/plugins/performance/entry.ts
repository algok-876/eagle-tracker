import { MPerformanceNavigationTiming } from '../../types';

export const getFP = (): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName('first-paint');
  return entry;
};

export const getFCP = (): PerformanceEntry | undefined => {
  const [entry] = performance.getEntriesByName('first-contentful-paint');
  return entry;
};

// 获取 NT
export const getNavigationTiming = (): MPerformanceNavigationTiming | undefined => {
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
      // 关键时间点
      FP: responseEnd - fetchStart,
      TTI: domInteractive - fetchStart,
      DomReady: domContentLoadedEventEnd - fetchStart,
      Load: loadEventStart - fetchStart,
      FirstByte: responseStart - domainLookupStart,
      // 关键时间段
      DNS: domainLookupEnd - domainLookupStart,
      TCP: connectEnd - connectStart,
      SSL: secureConnectionStart ? connectEnd - secureConnectionStart : 0,
      TTFB: responseStart - requestStart,
      Trans: responseEnd - responseStart,
      DomParse: domInteractive - responseEnd,
      Res: loadEventStart - domContentLoadedEventEnd,
    };
  };

  const navigation = performance.getEntriesByType('navigation').length > 0
    ? performance.getEntriesByType('navigation')[0]
    : performance.timing;
  return resolveNavigationTiming(navigation as PerformanceNavigationTiming);
};
