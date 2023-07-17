import Config from '../plugins/config';
/**
 * 解析错误类型
 * @param errorMessage 原始错误字符串
 * @returns 错误类型
 */
export function parseTypeError(errorMessage: string) {
  const regex = /TypeError|SyntaxError|RangeError|URIError|ReferenceError/;
  const match = errorMessage.match(regex);

  if (match) {
    return match[0];
  }
  return 'unknown error';
}

/**
 * 防抖函数
 * @param func 需要防抖的函数
 * @param delay 延迟执行的时间
 * @param callback 函数执行后的回调函数
 * @returns 防抖后的函数
 */
export function debounce(func: Function, delay: number, callback?: Function, context?: any) {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(context || this, args);
      if (callback) {
        callback();
      }
    }, delay);
  };
}

/**
 *  判断两个错误日志是否是来源于同一个错误
 * @param first 第一个错误
 * @param second 第二个错误
 * @returns 判断结果
 */
// TODO 判断逻辑很粗略，后序视具体情况更改
export function isSameErrorLog(first: IErrorLog, second: IErrorLog) {
  return first.type === second.type;
}
