import StackTrace from 'stacktrace-js';
import { merge } from 'lodash-es';
import Eagle from '../../index';
import { ErrorType, TransportCategory } from '../../types/enum';
import { debounce } from '../../utils';

export default class Tracker {
  private options: ITrackerOption = {
    enable: true,
    maxError: 16,
    sampling: 1,
    delay: 2000,
    concat: true,
  };

  // 存放已上报过或者正处在errorList中的错误uid
  private uidList: string[] = [];

  // 错误日志列表
  private errorList: IErrorLog[] = [];

  // 防抖版本的上报回调
  private report;

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
    const { delay } = this.options;
    // 包装一下report的防抖版本，用于延迟上报错误的场景
    this.report = debounce(this.host.transportInstance.log, delay, () => {

    }, this.host.transportInstance);
    // 不监控错误
    if (!this.options.enable) {
      if (this.host.configInstance.get('isTest')) {
        this.host.debugLogger('[测试环境]已关闭监控JS运行时错误，如需开启请设置record.tracker.enable为true');
      }
    } else {
      this.initJsError();
      this.intitPromiseError();
      this.initHttpError();
    }
  }

  /**
   * 初始化jserror
   */
  initJsError() {
    window.addEventListener('error', (async (event) => {
      // 阻止错误冒泡，避免在控制台出现
      if (!this.host.configInstance.get('isTest')) {
        event.preventDefault();
      }
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
      if (!this.host.configInstance.get('isTest')) {
        event.preventDefault();
      }
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
   * 初始化Http错误监控
   */
  initHttpError() {
    const loadHandler = (reqInfo: IHttplog) => {
      if (reqInfo.status < 400) return;

      const errorLog: IErrorLog = {
        title: document.title,
        errorType: ErrorType.API,
        mechanism: 'onloadend',
        url: `${window.window.location.href}${window.window.location.pathname}`,
        timestamp: Date.now(),
        meta: reqInfo,
        errorUid: this.host.getErrorUid(this.getHttpUidInput(
          ErrorType.API,
          reqInfo.response,
          reqInfo.statusText,
          reqInfo.status,
        )),
      };

      this.handleError(errorLog);
    };

    // 代理XMLHttpRequest和fetch，拦截错误
    this.proxyXMLHttpRequest(loadHandler);
    this.proxyFetch(loadHandler);
  }

  /**
   * 覆盖XMLHttpRequest
   * @param loadHandler 请求结束时 回调
   * @param sendHandler 请求开始前 回调
   */
  private proxyXMLHttpRequest(
    loadHandler: (data: IHttplog) => void,
    sendHandler?: (xhr: XMLHttpRequest) => void,
  ) {
    if (!window.XMLHttpRequest || typeof window.XMLHttpRequest !== 'function') {
      return;
    }
    // 保存原始XMLHttpRequest
    const OriginXMLHttpRequest = window.XMLHttpRequest;
    // 重写XMLHttpRequest
    (window as any).XMLHttpRequest = function CustomXMLHttpRequest() {
      const xhr = new OriginXMLHttpRequest();
      const { open, send } = xhr;
      // 收集http请求相关信息
      const metrics = {} as IHttplog;

      // 重写open方法收集请求方式、请求url
      xhr.open = (method: string, url: string | URL) => {
        metrics.method = method;
        metrics.url = url;
        open.call(xhr, method, url, true);
      };

      // 重写send方法收集请求体、请求开始时间
      xhr.send = (body) => {
        metrics.body = body;
        metrics.requestTime = new Date().getTime();
        if (typeof sendHandler === 'function') sendHandler(xhr);
        send.call(xhr, body);
      };

      // 监听请求结束事件，收集状态，响应，响应时间 并调用外部结束回调
      xhr.addEventListener('loadend', () => {
        const { status, statusText, response } = xhr;
        metrics.status = status;
        metrics.statusText = statusText;
        metrics.response = response;
        metrics.responseTime = new Date().getTime();
        if (typeof loadHandler === 'function') loadHandler(metrics);
      });

      return xhr;
    };
  }

  /**
   * 覆盖fetch方法
   * @param loadHandler 请求结束时 回调
   * @param sendHandler 请求开始前 回调
   */
  private proxyFetch(
    loadHandler: (data: IHttplog) => void,
    sendHandler?: (init?: RequestInit) => void,
  ) {
    if (!window.fetch || typeof window.fetch !== 'function') {
      return;
    }

    const originFetch = window.fetch;
    (window as any).fetch = async (input: any, init: RequestInit | undefined) => {
      if (typeof sendHandler === 'function') sendHandler(init);
      const metrics = {} as IHttplog;

      metrics.method = init?.method || '';
      metrics.url = (typeof input === 'string' ? input : input?.url) || '';
      metrics.body = init?.body || '';
      metrics.requestTime = Date.now();

      return originFetch.call(window, input, init).then(async (response) => {
        const res = response.clone();

        metrics.status = res.status;
        metrics.statusText = res.statusText;
        metrics.response = await res.text();
        metrics.responseTime = Date.now();

        if (typeof loadHandler === 'function') {
          loadHandler(metrics);
        }
        return response;
      });
    };
  }

  /**
   * 获取用于生成js错误标识码输入
   */
  getJSUidInput(type: ErrorType, message: string, filename: string) {
    return `${type}-${message}-${filename}`;
  }

  /**
   * 获取用于生成Promise错误标识码输入
   */
  getPromiseUidInput(type: ErrorType, reason: any) {
    return `${type}-${reason}`;
  }

  /**
   * 获取用于生成Http错误标识码输入
   */
  getHttpUidInput(type: ErrorType, value: any, statusText: string, status: number) {
    return `${type}-${value}-${statusText}-${status}`;
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
    const { concat } = this.options;
    // 是否立即上报
    if (!concat) {
      this.host.transportInstance.log(TransportCategory.ERROR, errorLog);
    } else {
      this.pushError(errorLog);
      this.report(TransportCategory.ERROR, this.errorList);
    }
  }
}