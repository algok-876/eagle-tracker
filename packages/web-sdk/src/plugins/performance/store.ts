import { Metric } from '@eagle-tracker/types';

/**
 * 需要收集的数据
 */
export enum metricsName {
  FP = 'first-paint',
  FCP = 'first-contentful-paint',
  LCP = 'largest-contentful-paint',
  FID = 'first-input-delay',
  CLS = 'cumulative-layout-shift',
  NT = 'navigation-timing',
  RF = 'resource-flow',
}

export default class metricsStore {
  state: Map<metricsName | string, Metric>;

  /**
   * Map 暂存数据
   */
  constructor() {
    this.state = new Map<metricsName | string, Metric>();
  }

  set(key: metricsName | string, value: Metric): void {
    this.state.set(key, value);
  }

  get(key: metricsName | string): Metric | undefined {
    return this.state.get(key);
  }

  has(key: metricsName | string): boolean {
    return this.state.has(key);
  }

  clear() {
    this.state.clear();
  }

  getValues() {
    // Map 转为 对象 返回
    return Object.fromEntries(this.state);
  }
}
