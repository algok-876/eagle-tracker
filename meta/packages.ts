interface IPackage {
  name: string,
  display: string, // 展示名
  description: string,
  keywords: string[],
  external: string[], // 外部依赖
  build: boolean, // 是否打包
  iife: boolean, // 是否打包 iife 格式
  cjs: boolean, // 是否打包 cjs 格式
  mjs: boolean, // 是否打包 mjs/es 格式
  dts: boolean, // 是否打包 ts声明
  target: string, // 打包的兼容性
  moduleJs: boolean, // 是否 main 入口指向 index.mjs
  utils: boolean // 含义：1.不会在文档中看到此分类 2.此分类只会参与打包到npm以及让库内其他包使用
  iifeName: string,
  globals: {
    [k: string]: string
  }
}

export default [
  {
    name: 'web-sdk',
    display: 'Eagle',
    description:
      '一个基于原生 js 的 【 行为埋点 / 性能采集 / 异常采集 / 请求采集 / 路由采集 】 插件',
    keywords: [
      '埋点',
      '性能',
      '异常',
      '性能采集',
      '异常采集',
      '前端埋点',
      '前端性能采集',
    ],
    iifeName: 'EagleTracker',
    external: ['@eagle-tracker/utils'],
  },
  {
    iifeName: 'EagleTrackerUtils',
    name: 'utils',
  },
] as Array<Partial<IPackage>>;
