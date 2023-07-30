import { ITrackerOption } from './tracker';

export interface IGlobalConfig {
  /**
   * 项目id，必填
   */
  appId: string,
  /**
   * 应用名称
   */
  appName: string,
  /**
   * 数据上报地址
   */
  dsn: string,
  /**
   * 应用版本
   */
  appVersion: string,
  /**
   * 用户id，如果有的话
   */
  uid: string,
  /**
   * 是否取消自动上报数据
   */
  manual: boolean,
  /**
   * 是否为测试数据, 默认为boolean(测试模式下打点数据仅供浏览, 不会展示在系统中)
   */
  isTest: boolean
  record: {
    timeOnPage: boolean // 是否监控用户在线时长数据, 默认为boolean
    performance: {
      /**
       * 是否上报资源加载情况数据
       */
      resource: boolean
      /**
       * 性能指标
       */
      timing: boolean
    }
    // 配置需要监控的页面报错类别
    error: {
      /**
       * js运行时报错
       */
      runtime: boolean
      /**
       * js资源加载失败
       */
      script: boolean
      /**
       * css资源加载失败
       */
      css: boolean
      /**
       * 图片资源加载失败
       */
      img: boolean //
      /**
       * 音频资源加载失败
       */
      audio: boolean
      /**
       * 视频资源加载失败
       */
      video: boolean
      /**
       * vue运行时报错
       */
      vue: boolean,
      /**
       * http请求错误
       */
      http: boolean
    }
  }
  tracker: ITrackerOption,
  famework: {
    /**
     * 是否是vue环境
     */
    vue: boolean,
    app: any
  }
}
