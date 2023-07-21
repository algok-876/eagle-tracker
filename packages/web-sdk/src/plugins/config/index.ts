import { merge, cloneDeep, get } from 'lodash-es';
import Eagle from '../../../index';
import { IGlobalConfig } from '../../types';

type DeepKeys<T> = T extends object
  ? {
    [K in keyof T]-?: K extends string | number
    ? `${K}` | `${K}.${DeepKeys<T[K]>}`
    : never;
  }[keyof T]
  : never;

// 默认配置
export const DEFAULT_CONFIG: Partial<IGlobalConfig> = {
  pid: '',
  uid: '',
  isTest: true,
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
    maxError: 16,
    sampling: 1,
    delay: 2000,
    concat: true,
  },
  famework: {
    vue: false,
    app: null,
  },
};
export default class Config {
  private config: Partial<IGlobalConfig> = cloneDeep(DEFAULT_CONFIG);

  private host: Eagle;

  /**
   * 配置插件
   * @param host 插件宿主
   */
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
      this.config = cloneDeep(customConfig);
    } else {
      this.config = merge(this.config, customConfig);
    }

    const isTest = get(this.config, 'is_test', get(DEFAULT_CONFIG, 'is_test'));

    if (isTest) {
      this.host.debugLogger('配置更新完毕');
      this.host.debugLogger('当前为测试模式');
      this.host.debugLogger('Tip: 测试模式下打点数据仅供浏览, 不会展示在系统中');
      this.host.debugLogger('更新后配置为:', this.config);
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
