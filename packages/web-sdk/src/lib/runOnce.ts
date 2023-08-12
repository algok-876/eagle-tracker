export interface RunOnceCallback {
  (...args: any[]): any;
}

/**
 * 将一个函数包装成一次性执行函数
 */
export const runOnce = <T extends RunOnceCallback>(cb: T) => {
  let called = false;
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    if (!called) {
      const result = cb(...args);
      called = true;
      return result;
    }
    return undefined;
  };
};
