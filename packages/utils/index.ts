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
 * 向控制台输出信息
 * @param method 打印方法
 * @param args 任意信息
 */
export function econsole(method: 'error' | 'log' | 'dir' | 'info', ...args: any[]) {
  console.group(
    `%c EagleTracker %c ${args[args.length - 1]} %c`,
    'background:#35495e ; padding: 1px 3px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:#41b883 ; padding: 1px 3px; border-radius: 0 3px 3px 0;  color: #fff',
    'background:transparent',
  );

  args.slice(0, -1).forEach((log) => {
    console[method](log);
  });
  console.groupEnd();
}

export * from './src/vue';
export * from './src/env';
