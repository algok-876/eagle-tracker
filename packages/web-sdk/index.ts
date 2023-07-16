// import { get } from 'lodash-es';
import Config from './plugins/config';
import Tracker from './plugins/js-tracker';
// import { debugLogger } from './utils';
import Core from './core';
import WebVitals from './plugins/performance';
import Transport from './plugins/transport';
import { TransportCategory } from './types/enum';

export default class Eagle extends Core {
  trackerInstance: Tracker;

  configInstance: Config;

  vitalsInstance: WebVitals;

  transportInstance: Transport;

  constructor(config: Partial<IGlobalConfig> = {}) {
    super();
    // 挂载插件
    this.configInstance = new Config(this);
    this.configInstance.set(config); // 更新配置
    this.transportInstance = new Transport(this);
    this.trackerInstance = new Tracker(this, {
      ...this.configInstance.get().tracker,
      report: (errorLog) => {
        console.log(errorLog);
        this.transportInstance.log(TransportCategory.ERROR, errorLog);
      },
    });
    this.vitalsInstance = new WebVitals(this, (data) => {
      console.log(data);
    });
  }
}
