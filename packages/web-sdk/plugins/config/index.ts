import { merge, cloneDeep, get } from 'lodash-es';
import Eagle from '../../index';

// 默认配置
export const DEFAULT_CONFIG: Partial<IGlobalConfig> = {
  ucid: '',
  uuid: '',
  is_test: true,
  record: {
    time_on_page: true,
    performance: true,
    // js_error: true,
    js_error_report_config: {
      ERROR_RUNTIME: true,
      ERROR_SCRIPT: true,
      ERROR_STYLE: true,
      ERROR_IMAGE: true,
      ERROR_AUDIO: true,
      ERROR_VIDEO: true,
      ERROR_CONSOLE: true,
      ERROR_TRY_CATCH: true,
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

  get() {
    return this.config;
  }
}
