import StackTrace from 'stacktrace-js';
import { merge } from 'lodash-es';
import { debounce } from '../../utils';
import Eagle from '../../index';
import { ErrorType } from '../../types/enum';

export default class Tracker {
  private options: ITrackerOption = {
    enable: true,
    maxError: 16,
    sampling: 1,
    delay: 2000,
    concat: true,
    report: () => { },
  };

  // 存放已上报过或者正处在errorList中的错误uid
  private uidList: string[] = [];

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
    } else {
      this.initJsError();
      this.intitPromiseError();
    }
  }

  /**
   * 初始化jserror
   */
  initJsError() {
    window.addEventListener('error', (async (event) => {
      // 阻止错误冒泡，避免在控制台出现
      event.preventDefault();
      const stack = await StackTrace.fromError(event.error);
      // 收集错误信息
      const errorLog: IJsErrorLog = {
        title: document.title,
        errorType: ErrorType.JS,
        mechanism: 'onerror',
        message: event.error.message,
        url: `${window.location.href}${window.location.pathname}`,
        timestamp: Date.now(),
        filename: event.filename,
        stack,
        errorUid: this.host.getErrorUid(
          this.getJSUidInput(ErrorType.JS, event.message, event.filename),
        ),
        type: this.host.parseTypeError(event.message),
      };
      this.handleError(errorLog);
    }), true);
  }

  /**
   * 初始化promise错误监控
   */
  intitPromiseError() {
    window.addEventListener('unhandledrejection', (event) => {
      // 阻止错误冒泡，避免在控制台出现
      event.preventDefault();
      const { reason } = event;
      const errorLog: IPromiseErrorLog = {
        title: document.title,
        errorType: ErrorType.UJ,
        mechanism: 'onunhandledrejection',
        url: `${window.window.location.href}${window.window.location.pathname}`,
        timestamp: Date.now(),
        type: event.type,
        errorUid: this.host.getErrorUid(this.getPromiseUidInput(ErrorType.UJ, event.reason)),
        reason,
      };
      this.handleError(errorLog);
    }, true);
  }

  /**
   * 获取用于生成js错误标识码输入
   */
  getJSUidInput(type: TransportType, message: string, filename: string) {
    return `${type}-${message}-${filename}`;
  }

  /**
   * 获取用于生成Promise错误标识码输入
   */
  getPromiseUidInput(type: TransportType, reason: any) {
    return `${type}-${reason}`;
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
    if (this.needReport(this.options.sampling)
      && this.errorList.length < this.options.maxError) {
      this.errorList.push(errorLog);
      this.uidList.push(errorLog.errorUid);
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
    // 在同一次会话中，重复的错误无需上报多次
    if (this.uidList.indexOf(errorLog.errorUid) >= 0) {
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
