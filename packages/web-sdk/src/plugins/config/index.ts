import { merge, cloneDeep, get } from 'lodash-es';
import { IGlobalConfig } from '../../types';

type DeepKeys<T> = T extends object
  ? {
    [K in keyof T]-?: K extends string | number
    ? `${K}` | `${K}.${DeepKeys<T[K]>}`
    : never;
  }[keyof T]
  : never;

// 默认配置
export const DEFAULT_CONFIG: IGlobalConfig = {
  pid: '',
  uid: '',
  isTest: false,
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
