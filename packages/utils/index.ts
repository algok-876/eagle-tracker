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