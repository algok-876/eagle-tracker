import { MPerformanceNavigationTiming } from '@eagle-tracker/types';

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
      firstInteractive: domInteractive - fetchStart,
      domReady: domContentLoadedEventEnd - fetchStart,
      load: loadEventStart - fetchStart,
      dns: domainLookupEnd - domainLookupStart,
      tcp: connectEnd - connectStart,
      ssl: secureConnectionStart ? connectEnd - secureConnectionStart : 0,
      http: responseStart - requestStart,
      trans: responseEnd - responseStart,
      domParse: domInteractive - responseEnd,
      resource: loadEventStart - domContentLoadedEventEnd,
    };
  };

  const navigation = performance.getEntriesByType('navigation').length > 0
    ? performance.getEntriesByType('navigation')[0]
    : performance.timing;
  return resolveNavigationTiming(navigation as PerformanceNavigationTiming);
};
