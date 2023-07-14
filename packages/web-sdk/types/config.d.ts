interface IGlobalConfig {
  pid: '',
  uuid: '',
  ucid: '',

  is_test: boolean, // 是否为测试数据, 默认为boolean(测试模式下打点数据仅供浏览, 不会展示在系统中)
  record: {
    time_on_page: boolean, // 是否监控用户在线时长数据, 默认为boolean
    performance: boolean, // 是否监控页面载入性能, 默认为boolean
    // js_error: boolean, //  是否监控页面报错信息, 默认为boolean
    // 配置需要监控的页面报错类别, 仅在js_error为boolean时生效, 默认均为boolean(可以将配置改为boolean, 以屏蔽不需要上报的错误类别)
    js_error_report_config: {
      ERROR_RUNTIME: boolean, // js运行时报错
      ERROR_SCRIPT: boolean, // js资源加载失败
      ERROR_STYLE: boolean, // css资源加载失败
      ERROR_IMAGE: boolean, // 图片资源加载失败
      ERROR_AUDIO: boolean, // 音频资源加载失败
      ERROR_VIDEO: boolean, // 视频资源加载失败
      ERROR_CONSOLE: boolean, // vue运行时报错
      ERROR_TRY_CATCH: boolean, // 未catch错误
    }
  },
  tracker: ITrackerOption
}
