import { merge, cloneDeep, get } from 'lodash-es';
import { IGlobalConfig } from '../../types';
import Eagle from '../../../index';

type DeepKeys<T> = T extends object
  ? {
    [K in keyof T]-?: K extends string | number
    ? `${K}` | `${K}.${DeepKeys<T[K]>}`
    : never;
  }[keyof T]
  : never;

// 默认配置
export const DEFAULT_CONFIG: IGlobalConfig = {
  appId: '',
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

  private host: Eagle;

  constructor(host: Eagle) {
    this.host = host;
  }

  /**
   * 更新配置
   * @param customConfig 配置对象
   * @param isOverwrite 是否覆盖默认配置，默认是递归合并配置
   */
  set(customConfig: Partial<IGlobalConfig>, isOverwrite = false) {
    if (isOverwrite) {
      this.config = cloneDeep(customConfig) as IGlobalConfig;
    } else {
      this.config = merge(this.config, customConfig);
    }
  }

  checkConfig() {
    const message: string[] = [];
    if (!this.config.appId) {
      message.push('appId为必填项');
    }
    const reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
    if (this.config.dsn) {
      if (!reg.test(this.config.dsn)) {
        message.push('dsn上报地址格式不正确');
      }
    } else {
      message.push('dsn上报地址为必填项');
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
  get(path: DeepKeys<IGlobalConfig>): any {
    return get(this.config, path, get(DEFAULT_CONFIG, path));
  }
}
