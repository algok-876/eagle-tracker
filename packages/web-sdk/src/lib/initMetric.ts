import { Metric } from '@eagle-tracker/types';

/**
 * 初始化度量
 * @param name 名称
 * @returns
 */
export function initMetric<MetricName extends Metric['name']>(name: MetricName): Metric {
  return {
    name,
    value: -1,
    rating: 'good',
    entries: [],
  };
}
