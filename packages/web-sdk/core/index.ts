export default class Core {
  /**
   * 解析错误类型
   * @param errorMessage 原始错误字符串
   * @returns 错误类型
   */
  parseTypeError(errorMessage: string) {
    const regex = /TypeError|SyntaxError|RangeError|URIError|ReferenceError/;
    const match = errorMessage.match(regex);

    if (match) {
      return match[0];
    }
    return 'unknown error';
  }

  debugLogger(...args: any[]) {
    console.info(...args);
  }

  /**
   * 获取错误标识码
   * @param input 用户生成错误标识码的原始信息
   * @returns 编码后的错误标识码
   */
  getErrorUid(input: string) {
    return window.btoa(input);
  }
}
