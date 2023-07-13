import { merge, cloneDeep, get } from 'lodash-es';
import { debugLogger } from '../../utils';

// 默认配置
export const DEFAULT_CONFIG: Partial<IGlobalConfig> = {
  ucid: '',
  uuid: '',
  is_test: true,
  record: {
    time_on_page: true,
    performance: true,
    js_error: true,
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
    maxError: 16,
    sampling: 1,
    delay: 2000,
    concat: true,
    report: () => { },
  },
};
export default class Config {
  private static config: Partial<IGlobalConfig> = cloneDeep(DEFAULT_CONFIG);

  static set(customConfig: Partial<IGlobalConfig>, isOverwrite = false) {
    if (isOverwrite) {
      Config.config = cloneDeep(customConfig);
    } else {
      Config.config = merge(Config.config, customConfig);
    }

    const isTest = get(Config.config, 'is_test', get(DEFAULT_CONFIG, 'is_test'));

    if (isTest) {
      debugLogger('配置更新完毕');
      debugLogger('当前为测试模式');
      debugLogger('Tip: 测试模式下打点数据仅供浏览, 不会展示在系统中');
      debugLogger('更新后配置为:', Config.config);
    }
  }

  static get() {
    return Config.config;
  }
}
