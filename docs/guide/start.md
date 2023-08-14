# 开始
eagle-tracker是一个集全方位错误监控、性能指标采集、用户行为于一体的前端监控SDK。

## 使用核心包
核心包基本适用于所有项目，但vue3项目推荐使用vue3版，可能更加方便。

### 通过CDN使用EagleTracker
提供了直出版本（即未对ES6+ 语法和API进行低版本转译）和polyfill版本（与直出版本相反）。其中polyfill版本都是经过压缩的，
直出版本有压缩与未压缩之分。
#### 直出版本

```html
<!-- 压缩版本 -->
<script src="https://unpkg.com/@eagle-tracker/core/dist/index.iife.min.js">
</script>
<!-- 未压缩版本 -->
<script src="https://unpkg.com/@eagle-tracker/core/dist/index.iife.js">
</script>
```


#### polyfill版本
```html
<script src="https://unpkg.com/@eagle-tracker/core/dist/index.iife.polyfill.js">
</script>
<!-- 或 -->
<script src="https://cdn.jsdelivr.net/npm/@eagle-tracker/core">
</script>
```
#### 使用示例
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
  <script src="https://unpkg.com/@eagle-tracker/core/dist/index.iife.polyfill.js"></script>
  <script>
    const eagle = new EagleTracker.EagleTracker({
      isTest: true,
      appId: 'XXXXXXXX',
      dsn: 'http://test.com/log'
    })
    eagle.start()
  </script>
</body>
</html>
```

### 通过npm使用EagleTracker
```bash
npm i @eagle-tracker/core
```

#### 使用示例
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

## 配合Vue3使用
### 通过CDN使用EagleTracker
#### 直出版本

```html
<!-- 压缩版本 -->
<script src="https://unpkg.com/@eagle-tracker/vue3/dist/index.iife.min.js">
</script>
<!-- 未压缩版本 -->
<script src="https://unpkg.com/@eagle-tracker/vue3/dist/index.iife.js">
</script>
```
#### polyfill版本
```html
<script src="https://unpkg.com/@eagle-tracker/vue3/dist/index.iife.polyfill.js">
</script>
<!-- 或 -->
<script src="https://cdn.jsdelivr.net/npm/@eagle-tracker/vue3">
</script>
```

#### 使用示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="app">{{ message }}</div>
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <script src="https://unpkg.com/@eagle-tracker/vue3/dist/index.iife.polyfill.js"></script>
  <script>
    const { createApp, ref } = Vue
    // 可以使用解构语法得到导出项
    const { useBeforeSendData, EagleTracker } = EagleTrackerVue3
    const app = createApp({
      setup() {
        const message = ref('Hello vue!')
        return {
          message
        }
      }
    })
    // 安装插件
    app.use(EagleTracker, {
      isTest: true,
      appId: 'XXXXXXXX',
      dsn: 'http://test.com/log'
    })
    app.mount('#app')

    useBeforeSendData((category, context) => {
      console.log('发送数据前')
      console.log(category, context)
    })
  </script>
</body>
</html>
```

### 通过npm使用EagleTracker
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
