import {
  get, merge, cloneDeep, DeepKeys, DeepType,
} from '@eagle-tracker/utils';
import { IGlobalConfig } from '@eagle-tracker/types';
import { EagleTracker } from '../../../index';

// import

// 默认配置
export const DEFAULT_CONFIG: IGlobalConfig = {
  appId: '',
  sendMode: 'img',
  dsn: '',
  appName: '',
  appVersion: '',
  uid: '',
  isTest: false,
  manual: false,
  record: {
    timeOnPage: true,
    performance: {
      resource: true,
      timing: true,
    },
    error: {
      script: true,
      vue: true,
      audio: true,
      video: true,
      runtime: true,
      css: true,
      img: true,
      http: true,
    },
  },
  ignoreResource: [],
  tracker: {
    enable: true,
    sampling: 1,
  },
  famework: {
    vue: false,
    app: null,
  },
};
export default class Config {
  private config: IGlobalConfig = cloneDeep(DEFAULT_CONFIG);

  private host: EagleTracker;

  constructor(host: EagleTracker) {
    this.host = host;
  }

  /**
   * 更新配置
   * @param customConfig 配置对象
   * @param isOverwrite 是否覆盖默认配置，默认是递归合并配置
   */
  set(customConfig: Partial<IGlobalConfig>) {
    this.config = merge(this.config, customConfig);
    console.log(this.config);
  }

  checkConfig() {
    const message: string[] = [];
    if (!this.config.appId) {
      message.push('appId为必填项');
    }
    const reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;

    if (this.config.sendMode === 'img' && this.config.dsn) {
      if (!this.config.dsn) {
        message.push('sendMode ===img 时 dsn属性必填');
      }
      if (!reg.test(this.config.dsn)) {
        message.push('dsn上报地址格式不正确');
      }
    } else if (this.config.sendMode === 'post' && this.config.postUrl) {
      if (!this.config.postUrl) {
        message.push('sendMode ===post 时 postUrl 属性必填');
      }
      if (!reg.test(this.config.postUrl)) {
        message.push('post 请求上报地址格式不正确');
      }
    } else {
      message.push('sendMode 为必填');
    }

    if (message.length > 0) {
      this.host.console('log', ...message, '配置项校验不通过');
      return false;
    }
    return true;
  }

  /**
   * 获取全局配置对象
   * @returns 全局配置对象
   */
  getALL() {
    return this.config;
  }

  /**
   * 获取配置项
   * @param path 目标值的路径
   * @returns 路径对应的值
   */
  get<T extends DeepKeys<IGlobalConfig>>(path: T): DeepType<IGlobalConfig, T> {
    return get(this.config, path, get(DEFAULT_CONFIG, path));
  }
}
