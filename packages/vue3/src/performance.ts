import { WebVitals } from '@eagle-tracker/core';
import eagle from './eagle';
// eslint-disable-next-line import/prefer-default-export
export function usePerformance(): WebVitals {
  return eagle.performance;
}
