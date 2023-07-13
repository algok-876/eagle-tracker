import { get } from 'lodash-es';
import Config, { DEFAULT_CONFIG } from './lib/config';
import Tracker from './lib/js-tracker';
import { IGlobalConfig } from './types/config';
import { debugLogger } from './utils';

export default class Eagle {
  static init(config: Partial<IGlobalConfig> = {}) {
    Config.set(config);
    const newConfig = Config.get();

    // 是否监听js运行时错误
    const isRecordJSError = get(
      newConfig,
      'record.js_error',
      get(DEFAULT_CONFIG, 'record.js_error'),
    );
    if (isRecordJSError) {
      const trackerOption = get(newConfig, 'tracker', get(DEFAULT_CONFIG, 'tracker'));
      Tracker.init(trackerOption);
    } else {
      debugLogger('[测试环境]已关闭监控JS运行时错误，如需开启请设置record.js_error为true');
    }
  }
}
