import StackTrace from 'stacktrace-js';
import { merge } from 'lodash-es';
import { debounce, isSameErrorLog } from '../../utils';
import Eagle from '../../index';

export default class Tracker {
  private options: ITrackerOption = {
    enable: true,
    maxError: 16,
    sampling: 1,
    delay: 2000,
    concat: true,
    report: () => { },
  };

  // 错误日志列表
  private errorList: IErrorLog[] = [];

  // 防抖版本的上报回调
  private report: (log: IErrorLog[]) => void;

  // 插件挂载的宿主
  private host: Eagle;

  /**
   * 错误监控类
   * @param host 插件宿主
   * @param opt 插件配置
   */
  constructor(host: Eagle, opt?: Partial<ITrackerOption>) {
    this.host = host;
    // 覆盖默认配置
    this.options = merge(this.options, opt);
    const { report, delay } = this.options;
    // 包装一下report的防抖版本，用于延迟上报错误的场景
    this.report = debounce(report, delay, () => {
      // 上报成功后清空错误列表，避免重复上报
      // Tracker.errorList.length = 0;
    });
    // 不监控错误
    if (!this.options.enable) {
      if (this.host.configInstance.get().is_test) {
        this.host.debugLogger('[测试环境]已关闭监控JS运行时错误，如需开启请设置record.tracker.enable为true');
      }
      return;
    }
    // 监听全局error事件
    window.addEventListener('error', (async (event) => {
      const stack = await StackTrace.fromError(event.error);
      // 收集错误信息
      const errorLog: IJsErrorLog = {
        title: document.title,
        errorType: 'jsError',
        mechanism: 'onerror',
        message: event.error.message,
        url: `${window.location.href}${window.location.pathname}`,
        timestamp: Date.now(),
        filename: event.filename,
        stack,
        type: this.host.parseTypeError(event.message),
      };
      this.handleError(errorLog);
    }), true);
    window.addEventListener('unhandledrejection', (event) => {
      const { reason } = event;
      const errorLog: IPromiseErrorLog = {
        title: document.title,
        errorType: 'promiseError',
        mechanism: 'onerror',
        url: `${window.window.location.href}${window.window.location.pathname}`,
        timestamp: Date.now(),
        type: event.type,
        reason,
      };
      this.handleError(errorLog);
    });
  }

  /**
   * 根据采样率决定错误是否需要处理
   * @param sampling 采样率
   * @returns {boolean}
   */
  private needReport(sampling = 1) {
    return Math.random() < (sampling || 1);
  }

  /**
   * 将错误信息加入错误列表中
   * @param errorLog 错误信息
   */
  private pushError(errorLog: IErrorLog) {
    const exists = this.errorList.findLastIndex((val) => isSameErrorLog(val, errorLog));
    // 相同的错误已存在错误列表中，不用重复上报
    if (exists >= 0 && this.errorList.length !== 0) {
      return;
    }

    if (this.needReport(this.options.sampling)
      && this.errorList.length < this.options.maxError) {
      this.errorList.push(errorLog);
    }
  }

  /**
   * 处理错误 延迟上报或者直接上报
   * @param errorLog 错误信息
   * @returns
   */
  private handleError(errorLog: IErrorLog) {
    // 采样率决定不需要上报
    if (!this.needReport()) {
      return;
    }
    const { concat, report } = this.options;
    // 是否立即上报
    if (!concat) {
      report(errorLog);
    } else {
      this.pushError(errorLog);
      this.report(this.errorList);
    }
  }
}
