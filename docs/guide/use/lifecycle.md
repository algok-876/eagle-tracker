# 生命周期
生命周期钩子会在特定的时机被运行，让开发者有机会在特定阶段运行自己的代码。


## onCatchError
当捕获到JS运行时错误，Promise错误，http请求错误，或者Vue组件运行中的错误时被触发  
使用`onCatchError`函数注册
### 回调类型
```typescript
type ErrorLifeCycleCallback = (type: ErrorType, log: IErrorLog) => void
```
### 举个例子 :chestnut:
```typescript
const eagle = new Eagle()
eagle.start()
instance.onCatchError((p1, p2) => {
  console.log(p1, p2)
})
```
## onMergeConfig
配置发生合并覆盖时会触发此回调，原因是多次实例化，详见[单例模式](/guide/single)
该生命周期在vue3中是不存在的

### 回调类型
```typescript
type ConfigLifeCycleCallback = (config: IGlobalConfig) => void
```
### 举个例子 :chestnut:
```typescript
const eagle = new Eagle()
eagle.start()
instance.onMergeConfig((config) => {
  console.log('哎呀配置被合并了，新配置为', config)
})
```
## beforeSendData

在数据上报之前会触发生命周期，优先级高于配置项，即使配置项中设置了不上报某个记录，在改生命周期中仍然可以获取上报的数据。
你可以拿到最终上报数据后自行处理。
### 回调类型
```typescript
type BeforeSendDataLifeCycleCallback =
  (category: TransportCategory, context: TransportStructure) => void
```
### 举个例子 :chestnut:
```typescript
const eagle = new Eagle()
eagle.start()
instance.beforeSendData((category, data) => {
  console.log(category, data)
})
```

## afterSendData

在数据上报后会触发生命周期
:::tip
case A: 如果配置项中设置了不上报某类错误或者数据  

csse B: 处于测试环境下  

case C: 开启了手动处理

if (A || B || C) {
  console.log("不触发此生命周期")
}
:::

### 回调类型
```typescript
type AfterSendDataLifeCycleCallback =
  (category: TransportCategory, context: TransportStructure) => void
```
### 举个例子 :chestnut:
```typescript
const eagle = new Eagle()
eagle.start()
instance.afterSendData((category, data) => {
  console.log(category, data)
})
```


## onCatchRSError

发生资源加载错误时，会触发该生命周期

### 回调类型
```typescript
type RSErrorLifeCycleCallback = (type: RSErrorType, log: RSErrorLog) => void
```
### 举个例子 :chestnut:
```typescript
const eagle = new Eagle()
eagle.start()
instance.onCatchRSError((type, log) => {
  console.log(type, log)
})
```

# 在Vue3中使用生命周期
由于在vue3中使用时，无法获取Eagle的实例，所以封装了一些函数可以使用以上的生命周期  
这种类似于hooks的方式，能更方便地在代码中任何地方设置生命周期

## useCatchError
和[onCatchError](#oncatcherror)具有同样的功能


### 举个例子 :chestnut:
```typescript
import { useCatchError } from '@eagle-tracker/vue3'

useCatchError((type, log) => {
  console.log('发生错误啦')
  console.log(type, log)
})
```

## useBeforeSendData
和[beforeSendData](#beforesenddata)具有同样的功能


### 举个例子 :chestnut:
```typescript
import { useBeforeSendData } from '@eagle-tracker/vue3'

useBeforeSendData((category, context) => {
  console.log(category, context)
})
```

## useAfterSendData
和[afterSendData](#aftersenddata)具有同样的功能


### 举个例子 :chestnut:
```typescript
import { useAfterSendData } from '@eagle-tracker/vue3'

useAfterSendData((category, context) => {
  console.log(category, context)
})
```

## useCatchRSError
和[onCatchRSError](#oncatchrserror)具有同样的功能


### 举个例子 :chestnut:
```typescript
import { useCatchRSError } from '@eagle-tracker/vue3'

useCatchRSError((type, log) => {
  console.log(type, log)
})
```

::: tip
生命周期可以被注册多次，执行时会全部触发，例如：
```typescript{4,7}
const eagle = new Eagle()
eagle.start()
instance.onCatchError(() => {
  console.log('第一个回调')
})
instance.onCatchError(() => {
  console.log('第二个回调')
})
```
vue3中
```typescript{4,7}
import { useCatchError } from '@eagle-tracker/vue3'

useCatchError((type, log) => {
  console.log('第一个回调')
})
useCatchError((type, log) => {
  console.log('第二个回调')
})
```
:::
