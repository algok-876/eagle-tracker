import { debounce, isSameErrorLog, parseTypeError } from "../../utils"

export default class Tracker {
  private static options: IDefOption = {
    maxError: 16,
    sampling: 1,
    delay: 2000,
    concat: true,
    report: () => { }
  }
  // 错误日志列表
  private static errorList: IErrorLog[] = []
  private static report: (log: IErrorLog[]) => void
  //初始化错误监听
  static init(opt?: Partial<IDefOption>) {
    // 覆盖默认配置
    Object.assign(Tracker.options, opt)
    const { report, delay } = Tracker.options
    // 包装一下report的防抖版本，用于延迟上报错误的场景
    Tracker.report = debounce(report, delay, () => {
      // 上报成功后清空错误列表，避免重复上报
      Tracker.errorList.length = 0
    })
    // 监听全局error事件
    window.addEventListener('error', (event) => {
      console.log(event)
      // 收集错误信息
      const errorLog: IJsErrorLog = {
        title: document.title,
        errorType: 'jsError',
        mechanism: 'onerror',
        message: event.error.message,
        url: `${location.href}${location.pathname}`,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now(),
        filename: event.filename,
        stack: event.error.stack,
        type: parseTypeError(event.message)
      }
      Tracker.handleError(errorLog)
    }, true)
    window.addEventListener('unhandledrejection', (event) => {
      let line = 0;
      let column = 0;
      let reason = event.reason;
      if (typeof reason === "object") {
        if (reason.stack) {
          var matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
          if (matchResult) {
            line = matchResult[2];
            column = matchResult[3];
          }
        }
      }
      const errorLog: IPromiseErrorLog = {
        title: document.title,
        errorType: 'promiseError',
        mechanism: 'onerror',
        url: `${location.href}${location.pathname}`,
        lineno: line,
        colno: column,
        timestamp: Date.now(),
        type: event.type,
        reason
      }
      Tracker.handleError(errorLog)
    })
  }

  /**
   * 根据采样率决定错误是否需要处理
   * @param sampling 采样率
   * @returns {boolean}
   */
  private static needReport(sampling: number = 1) {
    return Math.random() < (sampling || 1)
  }

  /**
   * 将错误信息加入错误列表中
   * @param errorLog 错误信息
   */
  private static pushError(errorLog: IErrorLog) {
    const exists = Tracker.errorList.findLastIndex((val) => {
      return isSameErrorLog(val, errorLog)
    });
    // 相同的错误已存在错误列表中，不用重复上报
    if (exists < 0) {
      return
    }

    if (Tracker.needReport(Tracker.options.sampling) &&
      Tracker.errorList.length < Tracker.options.maxError) {
      Tracker.errorList.push(errorLog)
    }
  }

  /**
   * 处理错误 延迟上报或者直接上报
   * @param errorLog 错误信息
   * @returns 
   */
  private static handleError(errorLog: IErrorLog) {
    // 采样率决定不需要上报
    if (!Tracker.needReport()) {
      return
    }
    const { concat, report } = Tracker.options
    // 是否立即上报
    if (!concat) {
      report(errorLog)
    } else {
      Tracker.pushError(errorLog)
      Tracker.report(Tracker.errorList)
    }
  }
}