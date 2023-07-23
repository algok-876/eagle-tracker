import { IGlobalConfig } from '../types';
import {
  ConfigLifeCycleCallback, ErrorLifeCycleCallback, LifeCycleName, ReportLifeCycleCallback,
} from '../types/core';

export default class Core {
  private lifeCycleMap = new Map<LifeCycleName, any[]>();

  /**
   * 解析错误类型
   * @param errorMessage 原始错误字符串
   * @returns 错误类型
   */
  parseTypeError(errorMessage: string) {
    const regex = /TypeError|SyntaxError|RangeError|URIError|ReferenceError/;
    const match = errorMessage.match(regex);

    if (match) {
      return match[0];
    }
    return 'unknown error';
  }

  /**
   * 获取错误标识码
   * @param input 用户生成错误标识码的原始信息
   * @returns 编码后的错误标识码
   */
  getErrorUid(input: string) {
    return window.btoa(input);
  }

  /**
   * 注册发生错误时生命周期
   * @param name 生命周期名字
   * @param fn 注册的生命周期函数
   */
  registerLifeCycle(name: LifeCycleName.ERROR, fn: ErrorLifeCycleCallback): void

  /**
   * 注册配置被合并时生命周期
   * @param name 生命周期名字
   * @param fn 注册的生命周期函数
   */
  registerLifeCycle(name: LifeCycleName.CONFIG, fn: ConfigLifeCycleCallback): void

  /**
   * 注册数据上报生命周期
   * @param name 生命周期名字
   * @param fn 注册的生命周期函数
   */
  registerLifeCycle(name: LifeCycleName.REPORT, fn: ReportLifeCycleCallback): void

  /**
   * 注册生命周期
   * @param name 生命周期名字
   * @param fn 注册的生命周期函数
   */
  registerLifeCycle(name: LifeCycleName, fn: any) {
    let task: any[] | undefined;
    if (!this.lifeCycleMap.has(name)) {
      this.lifeCycleMap.set(name, task = []);
    } else {
      task = this.lifeCycleMap.get(name);
    }
    task?.push(fn);
  }

  /**
   * 执行发生错误时的生命周期回调
   * @param name 生命周期名称
   * @param params 传递给生命周期回调的参数，数组方式
   */
  runLifeCycle(name: LifeCycleName.ERROR,
    params: [Parameters<ErrorLifeCycleCallback>[0], Parameters<ErrorLifeCycleCallback>[1]]): void

  /**
   * 执行配置被合并时的生命周期回调
   * @param name 生命周期名称
   * @param params 传递给生命周期回调的参数，数组方式
   */
  runLifeCycle(name: LifeCycleName.CONFIG,
    params: [IGlobalConfig]): void

  /**
   * 执行数据上报生命周期回调
   * @param name 生命周期名称
   * @param params 传递给生命周期回调的参数，数组方式
   */
  runLifeCycle(name: LifeCycleName.REPORT,
    params: [Parameters<ReportLifeCycleCallback>[0], Parameters<ReportLifeCycleCallback>[1]]): void

  /**
   * 执行生命周期回调
   * @param name 生命周期名称
   * @param params 传递给生命周期回调的参数，数组方式
   */
  runLifeCycle(name: LifeCycleName, params: any[]) {
    if (!this.lifeCycleMap.has(name)) {
      return;
    }
    const task = this.lifeCycleMap.get(name);
    task?.forEach((t) => {
      t(...params);
    });
  }
}
