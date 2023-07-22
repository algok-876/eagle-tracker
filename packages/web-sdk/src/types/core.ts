import { IErrorLog } from './tracker';
import { ErrorType } from './enum';
import { IGlobalConfig } from './config';

export const enum LifeCycleName {
  CONFIG = 'onMergeConfig',
  ERROR = 'onCatchError',
  REPORT = 'onReportData'
}

export type ErrorLifeCycleCallback = (type: ErrorType, log: IErrorLog) => void
export type ConfigLifeCycleCallback = (config: IGlobalConfig) => void
