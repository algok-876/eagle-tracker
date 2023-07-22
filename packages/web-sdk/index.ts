// import { get } from 'lodash-es';
import Config from './src/plugins/config';
import Tracker from './src/plugins/js-tracker';
// import { debugLogger } from './utils';
import Core from './src/core';
import WebVitals from './src/plugins/performance';
import Transport from './src/plugins/transport';
import { IGlobalConfig } from './src/types';

// 全局sdk单例对象
let sdkInstance: any;
export default class Eagle extends Core {
  trackerInstance!: Tracker;

  configInstance!: Config;

  vitalsInstance!: WebVitals;

  transportInstance!: Transport;

  constructor(config: Partial<IGlobalConfig> = {}) {
    // 如果已经实例化过了，就返回唯一的实例
    if (typeof sdkInstance === 'object' && sdkInstance instanceof Eagle) {
      // 重复实例化虽然不会返回不同的对象，但是配置会发生合并，注意是合并
      sdkInstance.configInstance.set(config);
      return sdkInstance;
    }
    super();
    // 挂载插件
    this.configInstance = new Config(this);
    this.configInstance.set(config); // 更新配置
    this.transportInstance = new Transport(this);
    this.trackerInstance = new Tracker(this, this.configInstance.get('tracker'));
    this.vitalsInstance = new WebVitals(this);
    sdkInstance = this;
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
