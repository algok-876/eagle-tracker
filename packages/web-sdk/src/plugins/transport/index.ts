import { cloneDeep } from '@eagle-tracker/utils';
import {
  UserOnlineRecord,
  TransportStructure,
  TransportData,
  PerformanceData,
  IErrorLog,
  ResourceItem,
  TransportCategory,
  IVueErrorLog,
  LifeCycleName,
  RSErrorLog,
} from '@eagle-tracker/types';
import { EagleTracker } from '../../../index';

/**
 * 上报策略
 */
interface IReportStrategies {
  [TransportCategory.CUS]?: boolean
  [TransportCategory.ERROR]?: boolean
  [TransportCategory.PERF]?: boolean
  [TransportCategory.PV]?: boolean
  [TransportCategory.RS]?: boolean
}

export default class Transport {
  private host: EagleTracker;

  private reportStrategies: IReportStrategies;

  /**
   * 数据上报插件
   * @param host 插件宿主
   */
  constructor(host: EagleTracker) {
    this.host = host;
    this.reportStrategies = {
      [TransportCategory.ERROR]: this.host.configInstance.get('record.error.runtime') === true,
      [TransportCategory.PERF]: this.host.configInstance.get('record.performance.timing') === true,
      [TransportCategory.RS]: this.host.configInstance.get('record.performance.resource') === true,
    };
  }

  /**
   * 格式化需上报的数据
   * @param category 数据分类
   * @param context 上报数据
   * @returns 格式化后的字符串，即JSON.stringify的输出
   */
  format(category: TransportCategory, context: TransportData) {
    const structure: TransportStructure = {
      appId: this.host.configInstance.get('appId'),
      appVersion: this.host.configInstance.get('appVersion'),
      appName: this.host.configInstance.get('appName'),
      uid: this.host.configInstance.get('uid'),
      context,
      env: this.host.getUserEnv(),
      timestamp: new Date().getTime(),
      category,
    };

    return structure;
  }

  /**
   * 上报错误数据
   * @param category 数据分类
   * @param context 上报数据
   */
  log(category: TransportCategory.ERROR, context: IErrorLog): void

  /**
   * 上报性能数据
   * @param category 数据分类
   * @param context 上报数据
   */
  log(category: TransportCategory.PERF, context: PerformanceData): void

  /**
   * 上报资源加载情况数据
   * @param category 数据分类
   * @param context 上报数据
   * @param once 只上报一次，不分开上报
   */
  log(category: TransportCategory.RS, context: ResourceItem[], once?: boolean): void

  /**
   * 上报vue错误
   * @param category 数据分类
   * @param context 上报数据
   */
  log(category: TransportCategory.VUEERROR, context: IVueErrorLog): void

  /**
   * 上报资源加载错误
   * @param category 数据分类
   * @param context 上报数据
   */
  log(category: TransportCategory.RSERROR, context: RSErrorLog): void

  /**
   * 上报用户在线数据
   * @param category 数据分类
   * @param context 上报数据
   */
  log(category: TransportCategory.ONLINE, context: UserOnlineRecord): void

  /**
   * 上报自定义数据
   * @param category 数据分类
   * @param context 上报数据
   */
  log(category: TransportCategory.CUS, context: any): void

  log(category: TransportCategory, context: TransportData) {
    // 格式化数据
    const transportData = this.format(category, context as TransportData);
    // 上报前生命周期
    this.host.runLifeCycle(LifeCycleName.BSEND, [category, cloneDeep(transportData)]);
    // 测试时不上报数据
    if (this.host.configInstance.get('isTest') === true) {
      this.host.console('log', `类别: ${category}`, context, '跳过上报');
      return;
    }
    // 判断该类型的数据是否需要上报  等于undefined认为无该配置项可以上报
    if (this.reportStrategies[category] !== undefined
      && this.reportStrategies[category] === false) {
      this.host.console('log', '根据配置项，跳过该数据 ===>', `类别: ${category}`, context, '跳过上报');
      return;
    }
    // 取消自动上报数据
    if (this.host.configInstance.get('manual') === true) {
      return;
    }
    this.send(JSON.stringify(transportData));
    // 上报后生命周期
    this.host.runLifeCycle(LifeCycleName.ASEND, [category, cloneDeep(transportData)]);
  }

  private send(transportStr: string) {
    const dsn = this.host.configInstance.get('dsn');
    const img = new Image();
    img.src = `${dsn}?data=${encodeURIComponent(transportStr)}`;
  }
}
