import {
  IErrorLog, IHttpErrorLog, IJsErrorLog, IPromiseErrorLog,
} from './tracker';

/**
 * 辨别是否是JS运行时错误
 * @param errorLog 错误日志/数据
 * @returns boolean
 */
export function isJSError(errorLog: IErrorLog): errorLog is IJsErrorLog {
  return (errorLog as IJsErrorLog).errorType === 'js-error';
}

/**
 * 辨别是否是接口错误
 * @param errorLog 错误日志/数据
 * @returns boolean
 */
export function isHttpError(errorLog: IErrorLog): errorLog is IHttpErrorLog {
  return (errorLog as IHttpErrorLog).errorType === 'api-error';
}

/**
 * 辨别是否是Promise错误
 * @param errorLog 错误日志/数据
 * @returns boolean
 */
export function isPromiseError(errorLog: IErrorLog): errorLog is IPromiseErrorLog {
  return (errorLog as IPromiseErrorLog).errorType === 'promise-error';
}
