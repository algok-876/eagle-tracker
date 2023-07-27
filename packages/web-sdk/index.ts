// import { get } from 'lodash-es';
import { econsole } from '@eagle-tracker/utils/index';
import Config from './src/plugins/config';
import Tracker from './src/plugins/js-tracker';
// import { debugLogger } from './utils';
import Core from './src/core';
import WebVitals from './src/plugins/performance';
import Transport from './src/plugins/transport';
import { IGlobalConfig } from './src/types';
import {
  AfterSendDataLifeCycleCallback,
  BeforeSendDataLifeCycleCallback,
  ConfigLifeCycleCallback,
  ErrorLifeCycleCallback,
  LifeCycleName,
  RSErrorLifeCycleCallback,
} from './src/types/core';

// 全局sdk单例对象
let sdkInstance: any;
export default class Eagle extends Core {
  trackerInstance!: Tracker;

  configInstance!: Config;

  vitalsInstance!: WebVitals;

  transportInstance!: Transport;

  private isStart = false;

  constructor(config: Partial<IGlobalConfig> = {}) {
    // 如果已经实例化过了，就返回唯一的实例
    if (typeof sdkInstance === 'object' && sdkInstance instanceof Eagle) {
      // 重复实例化虽然不会返回不同的对象，但是配置会发生合并，注意是合并
      sdkInstance.configInstance.set(config);
      sdkInstance.runLifeCycle(LifeCycleName.CONFIG, [sdkInstance.configInstance.getALL()]);
      return sdkInstance;
    }
    super();
    // 挂载插件
    this.configInstance = new Config(this);
    // 更新配置
    this.configInstance.set(config);
    this.transportInstance = new Transport(this);
    sdkInstance = this;
  }

  /**
   * 启动
   */
  start() {
    if (this.isStart) {
      return;
    }
    if (!this.configInstance.checkConfig()) {
      return;
    }
    this.trackerInstance = new Tracker(this, this.configInstance.get('tracker'));
    this.vitalsInstance = new WebVitals(this);
    this.isStart = true;
  }

  /**
   * 在测试模式下打印控制台信息
   * @param method 打印方法
   * @param args 每个输出独占一行， 最后一个参数是标题
   */
  console(method: 'error' | 'log' | 'dir' | 'info', ...args: any[]) {
    if (this.configInstance.get('isTest') === true) {
      econsole(method, ...args);
    }
  }

  /**
   * 获取vue错误处理函数
   * @returns vue错误处理函数
   */
  getVueErrorhandler() {
    return this.trackerInstance.vueErrorhandler();
  }

  /**
   * 注册onCatchError生命周期函数
   * @param cb 生命周期回调
   */
  onCatchError(cb: ErrorLifeCycleCallback) {
    this.registerLifeCycle(LifeCycleName.ERROR, cb);
  }

  /**
   * 注册onCatchRSError生命周期函数
   * @param cb 生命周期回调
   */
  onCatchRSError(cb: RSErrorLifeCycleCallback) {
    this.registerLifeCycle(LifeCycleName.RSERROR, cb);
  }

  /**
   * 注册配置合并时生命周期函数
   * @param cb 生命周期回调
   */
  onMergeConfig(cb: ConfigLifeCycleCallback) {
    this.registerLifeCycle(LifeCycleName.CONFIG, cb);
  }

  /**
   * 注册数据上报之前生命周期函数
   * @param cb 生命周期回调
   */
  beforeSendData(cb: BeforeSendDataLifeCycleCallback) {
    this.registerLifeCycle(LifeCycleName.BSEND, cb);
  }

  /**
   * 注册数据上报之前生命周期函数
   * @param cb 生命周期回调
   */
  afterSendData(cb: AfterSendDataLifeCycleCallback) {
    this.registerLifeCycle(LifeCycleName.ASEND, cb);
  }
}

// 导出所有类型
export * from './src/types';
