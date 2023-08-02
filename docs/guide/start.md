# 开始
eagle-sdk是一个基于 javascript 的监控前端错误、性能、用户行为的插件

## 直接使用

### 安装npm包
```bash
npm i @eagle-tracker/core
```

### 在项目中使用
```javascript
import { EagleTracker } from '@eagle-tracker/core'

const eagle = new EagleTracker({
  isTest: true,
  appId: 'XXXXXXXX',
  dsn: 'http://test.com/log'
})
eagle.start()
```
::: tip
要调用start方法之后才算正式启动了sdk
::: 

## 在Vue3项目中使用

### 安装npm包
```bash
npm i @eagle-tracker/vue3
```

### 在项目中使用
```javascript
import { EagleTracker } from '@eagle-tracker/vue3'

const app = createApp(App)
app.use(EagleTracker, {
  isTest: true,
  appId: 'XXXXXXXX',
  dsn: 'http://test.com/log'
})
```
