# 配置项

:::warning
sdk还处于开发阶段，配置项可能会经常变动
:::

## main 主要配置
| 名称                | 类型                 | 必填   | 默认值    | 说明                          |
| ------------------- | -------------------- | ------ | --------- | ----------------------------- |
| pid                 | string               | **是** | -         | 项目id                      |
| isTest             | boolean               | 否     | false         | 时候是测试环境，测试环境不上报数据，同时伴有控制台输出            |
| tracker             | object               | 否     | -         | ***详细见下方***  [tracker](#tracker-监控)                    |
| record              | object               | 否     | -         | ***详细见下方*** [record](#record-数据记录)      |

## tracker 监控
| 名称                | 类型                 | 必填   | 默认值    | 说明                          |
| ------------------- | -------------------- | ------ | --------- | ----------------------------- |
| enable               | boolean               | 否     | true         | 是否监控错误                      |
| sampling             | number               | 否     | 1         | 错误上报率 0-1            |


## record 数据记录
| 名称                | 类型                 | 必填   | 默认值    | 说明                          |
| ------------------- | -------------------- | ------ | --------- | ----------------------------- |
| timeOnPage               | boolean               | 否     | true         | 是否记录用户在线时长       |
| performance             | object               | 否     | -        | 性能记录相关配置   ***详细见下方***   [performance](#performance)      |
| error             | object               | 否     | -        | 错误记录相关配置    ***详细见下方*** [error](#error)       |

### performance

| 名称                | 类型                 | 必填   | 默认值    | 说明                          |
| ------------------- | -------------------- | ------ | --------- | ----------------------------- |
| resource               | boolean               | 否     | true         | 是否记录资源加载情况   |
| timing               | boolean               | 否     | true         | 是否记录各种性能指标   |

### error

| 名称                | 类型                 | 必填   | 默认值    | 说明                          |
| ------------------- | -------------------- | ------ | --------- | ----------------------------- |
| script               | boolean               | 否     | true         | 是否记录脚本加载错误   |
| vue               | boolean               | 否     | true         | 是否记录被vue全局处理函数拦截的错误   |
| audio               | boolean               | 否     | true         | 是否记录audio加载错误   |
| video               | boolean               | 否     | true         | 是否记录video加载错误   |
| css               | boolean               | 否     | true         | 是否记录css加载错误   |
| img               | boolean               | 否     | true         | 是否记录图片加载错误   |
| http               | boolean               | 否     | true         | 是否记录http请求错误   |
| runtime               | boolean               | 否     | true         | 是否记录js运行时错误   |

## 默认配置
在不传递任何配置项时，会有默认配置。如果传递了配置项会发生配置的合并覆盖

```json
{
  pid: '',
  isTest: false,
  record: {
    timeOnPage: true,
    performance: {
      resource: true,
      timing: true,
    },
    error: {
      script: true,
      vue: true,
      audio: true,
      video: true,
      runtime: true,
      css: true,
      img: true,
      http: true,
    },
  },
  tracker: {
    enable: true,
    sampling: 1,
  },
};
```