import { ErrorLifeCycleCallback, ReportLifeCycleCallback } from '@eagle-tracker/core';
import eagle from './eagle';

export function useCatchError(cb: ErrorLifeCycleCallback) {
  eagle.onCatchError(cb);
}

export function useReportData(cb: ReportLifeCycleCallback) {
  eagle.onReportData(cb);
}
