// import { get } from 'lodash-es';
import Config from './plugins/config';
import Tracker from './plugins/js-tracker';
// import { debugLogger } from './utils';
// import WebVitals from './plugins/performance';
import Core from './core';

export default class Eagle extends Core {
  trackerInstance: Tracker;

  configInstance: Config;

  constructor(config: Partial<IGlobalConfig> = {}) {
    super();
    // 挂载插件
    this.configInstance = new Config(this);
    this.configInstance.set(config); // 更新配置
    this.trackerInstance = new Tracker(this, this.configInstance.get().tracker);
  }
}
