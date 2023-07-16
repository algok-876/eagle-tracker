// import { get } from 'lodash-es';
import Config from './plugins/config';
import Tracker from './plugins/js-tracker';
// import { debugLogger } from './utils';
import Core from './core';
import WebVitals from './plugins/performance';

export default class Eagle extends Core {
  trackerInstance: Tracker;

  configInstance: Config;

  vitalsInstance: WebVitals;

  constructor(config: Partial<IGlobalConfig> = {}) {
    super();
    // 挂载插件
    this.configInstance = new Config(this);
    this.configInstance.set(config); // 更新配置
    this.trackerInstance = new Tracker(this, this.configInstance.get().tracker);
    this.vitalsInstance = new WebVitals(this, (data) => {
      console.log(data);
    });
  }
}
