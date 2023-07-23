import { IErrorLog } from './tracker';
import { ErrorType, TransportCategory } from './enum';
import { IGlobalConfig } from './config';
import { TransportStructure } from './transport';

export const enum LifeCycleName {
  CONFIG = 'onMergeConfig',
  ERROR = 'onCatchError',
  REPORT = 'onReportData'
}

export type ErrorLifeCycleCallback = (type: ErrorType, log: IErrorLog) => void
export type ConfigLifeCycleCallback = (config: IGlobalConfig) => void
export type ReportLifeCycleCallback =
  (category: TransportCategory, context: TransportStructure) => void
