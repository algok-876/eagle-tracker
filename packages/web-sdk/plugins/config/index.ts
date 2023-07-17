import { merge, cloneDeep, get } from 'lodash-es';
import Eagle from '../../index';

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
    },
  },
  tracker: {
    enable: true,
    maxError: 16,
    sampling: 1,
    delay: 2000,
    concat: true,
    report: () => { },
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

  getALL() {
    return this.config;
  }

  get(path: string) {
    return get(this.config, path, get(DEFAULT_CONFIG, path));
  }
}
