import {
  getBrowser, getOS, getDeviceType, getScreenResolution,
} from '@eagle-tracker/utils';
import { LifeCycleName } from '@eagle-tracker/types';
import { RegParamterMapping, RunParamterMapping } from './type';

type DeviceType = 'Mobile' | 'Tablet' | 'Desktop'
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
    // debugger;
    return window.btoa(encodeURIComponent(input));
  }

  /**
   * 获取用户环境相关数据
   * @returns 浏览器类型，操作系统，设备类型，屏幕分辨率
   */
  getUserEnv() {
    return {
      browser: getBrowser(),
      os: getOS(),
      deviceType: getDeviceType() as DeviceType,
      screen: getScreenResolution(),
    };
  }

  /**
   * 注册生命周期
   * @param name 生命周期名字
   * @param fn 注册的生命周期函数
   */
  registerLifeCycle<T extends keyof RegParamterMapping>(name: T, fn: RegParamterMapping[T]) {
    let task: any[] | undefined;
    if (!this.lifeCycleMap.has(name)) {
      this.lifeCycleMap.set(name, task = []);
    } else {
      task = this.lifeCycleMap.get(name);
    }
    task?.push(fn);
  }

  /**
   * 执行生命周期回调
   * @param name 生命周期名称
   * @param params 传递给生命周期回调的参数，数组方式
   */
  runLifeCycle<T extends keyof RunParamterMapping>(name: T, params: RunParamterMapping[T]) {
    if (!this.lifeCycleMap.has(name)) {
      return;
    }
    const task = this.lifeCycleMap.get(name);
    task?.forEach((t) => {
      t(...params);
    });
  }
}
