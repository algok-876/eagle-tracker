// import { get } from 'lodash-es';
import Config from './src/plugins/config';
import Tracker from './src/plugins/js-tracker';
// import { debugLogger } from './utils';
import Core from './src/core';
import WebVitals from './src/plugins/performance';
import Transport from './src/plugins/transport';
import { IGlobalConfig } from './src/types';

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

export * from './src/types';
export const a = 100;
