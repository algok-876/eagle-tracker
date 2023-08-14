# 自定义埋点
在项目中或多或少有一些自定义的需求，比如统计用户某种行为的时长或者某种操作耗时，又或者是某段代码的执行时间。
这显然需要手动在合适的位置进行打点来统计的，本节的内容就是解决这个问题的。
## 相关API
以下是基于[Performance User_Timing API](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance_API/User_timing)
封装的用于埋点的API。相较于使用原生的API，更加语义化，代码结构会更加清晰，可以从根本杜绝某些错误的用法（下面会看到）

### 使用
```typescript
// core
cosnt eagle = new EagleTracker({
  isTest: true,
  appId: 'test123',
  dsn: 'http://test.com/log',
})
const perf = eagle.performance

// vue3
import { usePerformance } from '@eagle-tracker/vue3'
const perf = usePerformance()
```
下列API都是perf的属性

### markStart
#### 类型
```typescript
markStart(name: string): boolean
```
#### 说明
用于手动标记开始位置。name是该标记的名称，不可重复。返回值表示是否创建成功

### markEnd
#### 类型
```typescript
markEnd(name: string): boolean
```
#### 说明
用于手动标记结束位置。name是该标记的名称，不可重复。
创建结束标记前必须已经存在同名的开始标记
```typescript
// wrong ❌ 不能先添加结束标记
perf.markEnd('test')
// do something.....
perf.markStart('test')

// wrong ❌ 开始标记应该和结束标记同名，否则无法匹配
perf.markStart('test1')
// do something.....
perf.markEnd('test')

// good ✔️ 正确的做法
perf.markStart('test')
// do something.....
perf.markEnd('test')
```

::: tip 说明
你可以想象有一条很长的时间线，开始标记和结束标记是这个条时间线上的两个点，一对匹配的开始标记和结束标记表示了一段时间。
:::

### measure
#### 类型
```typescript
measure(name: string): boolean
```
#### 说明
创建性能测量，会匹配同名的开始标记和结束标记并测量其时间差，name是标记名称。调用该方法前请确保存在同名的开始和结束标记。

::: tip 说明
不允许结束标记先于开始标记被创建。是因为，如果这样的话，在测量两个标记的时间差的时候会出现负值
:::

### getMeasure
#### 类型
```typescript
getMeasure(name: string): PerformanceMeasure[]
```
#### 说明
获取存在的性能测量，数组的第一项则是测量数据。

```typescript
perf.markStart('settimeout')
setTimeout(() => {
  perf.markEnd('settimeout')
  perf.measure('settimeout')
  console.log('settimeout measure', p.getMeasure('settimeout'))
}, 2000)
```
返回数据示例，如果不存在对应的性能测量，则返回空数组
```json
[
  {
    "name": "settimeout-duration",
    "entryType": "measure",
    "startTime": 123.7999999821186,
    "duration": 2009.300000011921
  }
]
```
数据类型可参考 [PerformanceMeasure](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMeasure)

### getMarks
#### 类型
```typescript
getMarks(name: string): PerformanceMark[]
```
#### 说明
返回一个标记数组，包括开始标记和结束标记，具体返回值参考 [PerformanceMark](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceMark)


### getAllMeasure
#### 类型
```typescript
getAllMeasure(): {
  [prop: string]: PerformanceMeasure;
}
```
#### 说明
获取所有使用[measure](#measure)创建的性能测量。如果使用原生方法创建的性能测量不能通过该API获取到

### clearEndMark
#### 类型
```typescript
clearEndMark(name: string): void
```
#### 说明
清除已经创建的结束标记。因为不能重复创建结束标记，如果有重新patch结束标记的需求可以先清除已经创建的结束标记。

::: info 建议
开始标记是不能被清除的，如果确实需要清除开始标记，那么重新创建一对标记是更好的做法。
:::

### clearMeasure
#### 类型
```typescript
clearMeasure(name: string): void;
```
#### 说明
清除已存在的性能测量。如果一个性能测量所依赖的结束标记被清除时，该性能测量不会消失，如果恰巧这个结束标记被重新打在了其他位置
，就会拿到旧的测量数据。建议清除结束标记的同时清除对应的性能测量（如果有的话），清除一个不存在的性能测量并不会报错。

