// import { get } from 'lodash-es';
import Config from './plugins/config';
import Tracker from './plugins/js-tracker';
// import { debugLogger } from './utils';
import Core from './core';
import WebVitals from './plugins/performance';
import Transport from './plugins/transport';
import { IGlobalConfig } from './types';

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
    this.trackerInstance = new Tracker(this, this.configInstance.get('tracker'));
    this.vitalsInstance = new WebVitals(this);
  }

  /**
   * 获取vue错误处理函数
   * @returns vue错误处理函数
   */
  getVueErrorhandler() {
    return this.trackerInstance.vueErrorhandler();
  }
}

export * from './types';
