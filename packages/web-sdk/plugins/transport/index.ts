import Eagle from '../../index';
import { TransportCategory } from '../../types/enum';
import { TransportStructure, TransportData } from '../../types/transport';

export default class Transport {
  private host: Eagle;

  /**
   * 数据上报插件
   * @param host 插件宿主
   */
  constructor(host: Eagle) {
    this.host = host;
  }

  /**
   * 格式化需上报的数据
   * @param category 数据分类
   * @param context 上报数据
   * @returns 格式化后的字符串，即JSON.stringify的输出
   */
  format(category: TransportCategory, context: TransportData) {
    const structure: TransportStructure = {
      pid: this.host.configInstance.get('pid'),
      context,
      env: 'env',
      timestamp: new Date().getTime(),
      category,
    };

    return JSON.stringify(structure);
  }

  /**
   * 上报错误数据
   * @param category 数据分类
   * @param context 上报数据
   */
  log(category: TransportCategory.ERROR, context: IErrorLog | IErrorLog[]): void

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
   * 上报自定义数据
   * @param category 数据分类
   * @param context 上报数据
   */
  log(category: TransportCategory.CUS, context: any): void

  log(category: TransportCategory, context: TransportData | TransportData[], once = false) {
    // TODO 这里可能需要根据全局配置过滤一下上报的数据
    if (once) {
      const transportStr = this.format(category, context as TransportData);
      this.send(transportStr);
      return;
    }
    // 将单个log装成数组，兼容满足批量上报需求
    const data: TransportData[] = [];
    if (!Array.isArray(context)) {
      data.push(context);
    } else {
      data.push(...context);
    }
    // 依次上报数组中的数据
    data.forEach((errorlog) => {
      const transportStr = this.format(category, errorlog);
      this.send(transportStr);
    });
  }

  private send(transportStr: string) {
    const dest = 'http://weiwei8848.com/log/log.png';
    const img = new Image();
    img.src = `${dest}?d=${encodeURIComponent(transportStr)}`;
  }
}
