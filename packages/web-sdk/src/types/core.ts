import { IErrorLog, RSErrorLog } from './tracker';
import { ErrorType, RSErrorType, TransportCategory } from './enum';
import { IGlobalConfig } from './config';
import { TransportStructure } from './transport';

export const enum LifeCycleName {
  CONFIG = 'onMergeConfig',
  ERROR = 'onCatchError',
  RSERROR = 'onCatchRSError',
  ASEND = 'afterSendData',
  BSEND = 'beforeSendData'
}

export type ErrorLifeCycleCallback = (type: ErrorType, log: IErrorLog) => void
export type ConfigLifeCycleCallback = (config: IGlobalConfig) => void
export type ReportLifeCycleCallback =
  (category: TransportCategory, context: TransportStructure) => void
export type RSErrorLifeCycleCallback = (type: RSErrorType, log: RSErrorLog) => void
export type BeforeSendDataLifeCycleCallback =
  (category: TransportCategory, context: TransportStructure) => void
export type AfterSendDataLifeCycleCallback =
  (category: TransportCategory, context: TransportStructure) => void
