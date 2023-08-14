# 用户在线时长统计

如果你有这样的需求，那么这个功能会让你事半功倍
- 在SPA项目中，想获取用户的跳转记录，并且得知用户在每个页面的停留时间
- 在传统多页面项目中，记录用户在线时长

::: tip
强烈建议在配置项中根据具体业务填写uid，这样上报的数据中会含有uid，数据到达服务端之后
可以把在线时长或浏览记录和用户关联起来。方便后续分析。
:::

## 如何使用
使用很简单，当配置项`record.timeOnPage`为true时,会自动统计用户浏览页面的记录及每次停留时长

### 获取数据
你可以通过以下方式，来获取有关数据

#### getPageRecord（传统多页面应用）
EagleTracker实例会暴露一个getPageRecord方法，可以用来获取已经统计的页面记录，例如

```javascript
const instance = new EagleTracker({
  manual: true,
  appId: 'test123',
  dsn: 'http://test.com/log'
})

console.log(instance.getPageRecord())
```
如下是返回的数据结构示例
```json
[
  {
    "pageTitle": "Vite App",
    "path": "/index",
    "startTime": 1690714317697,
    "endTime": 0,
    "duration": 0
  }
]
```
其中endTime和duration为0表示当前用户还处于当前页面，无结束时间与停留时间。这是在传统多页面项目中的结果,这个数组中只有一项 

下面这个例子是在使用了Vue-Router的Vue项目中的使用

#### getPageRecord（SPA）

```typescript
import { getPageRecord } from "@eagle-tracker/vue3"

console.log(getPageRecord())
```
一个最佳实践是结合路由守卫，来获取页面记录，例如
```typescript{1,17}
import { getPageRecord } from "@eagle-tracker/vue3"
import { createRouter, createWebHistory } from "vue-router"
const routes = [
  { path: '/', component: () => import('../views/index.vue') },
  { path: '/page1', component: () => import('../views/page1.vue') },
  { path: '/page2', component: () => import('../views/page2.vue') },
  { path: '/page3', component: () => import('../views/page3.vue') },
  { path: '/page4', component: () => import('../views/page4.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach(() => {
  console.log(getPageRecord())
})
```
::: tip
使用afterEach而不使用beforeEach的原因是beforeEach执行时并未发生页面跳转，所以获取到的页面记录还是旧的，也就是说不包含
即将要跳转的页面。而在afterEach中可以拿到最新的页面记录。
:::

你可能会得到这样的数据
```json
[
  {
    "pageTitle": "Vite + Vue + TS",
    "path": "/page4",
    "startTime": 1690720169229,
    "endTime": 1690720171097,
    "duration": 1868
  },
  {
    "pageTitle": "Vite + Vue + TS",
    "path": "/page1",
    "startTime": 1690720171097,
    "endTime": 1690720171610,
    "duration": 513
  },
  {
    "pageTitle": "Vite + Vue + TS",
    "path": "/page2",
    "startTime": 1690720171610,
    "endTime": 1690720172057,
    "duration": 447
  },
  {
    "pageTitle": "Vite + Vue + TS",
    "path": "/page3",
    "startTime": 1690720172057,
    "endTime": 1690720178957,
    "duration": 6900
  },
  {
    "pageTitle": "Vite + Vue + TS",
    "path": "/page2",
    "startTime": 1690720178957,
    "endTime": 0,
    "duration": 0
  }
]
```
## 分析用户浏览行为
上述数据中的每一项记录都是用户所浏览页面的先后顺序，在跳转至新页面之后会计算上一次所处页面的离开时间和停留时间，并加入当前页面的记录。
比如上面数据可以解读为
1. 用户打开站点进入的第一个页面是`/page4`
2. 随后打开了`/page1`页面，离开`/page4`页面的时间是1690720171097，在`/page4`页面停留的时间是1868毫秒
3. 随后又打开了`/page2`页面 .....
   
这样的数据是能够反映用户的浏览行为的，所以可以基于此进行进一步分析与处理
## 获取页面总时长
上面所展示的页面记录是完全按照用户的访问先后顺序产生的，这样就会产生一个问题，用户可能多次离开和进入同一个页面。
那么在记录中就会有同一个页面的多个记录，就会有多个停留时间，进入页面时间和离开页面时间。

为了能够在这种情况下知道用户在整个浏览过程中，停留在同一个页面的总时长。在内部做了分组和聚合，类似于SQL的group by子句和聚合函数
你可以在beforeSendData生命周期中拿到处理过后的数据，以vue举例

```typescript
import { useBeforeSendData, TransportCategory } from "@eagle-tracker/vue3"
useBeforeSendData((category, context) => {
  if (category === TransportCategory.ONLINE) {
    console.log(context.context)
  }
})
```
聚合后的数据如下所示
```json
{
  "/page2": {
    "pageTitle": "Vite + Vue + TS",
    "path": "/page2",
    "startTime": 1690723194295,
    "endTime": 1690723199564,
    "duration": 4521
  },
  "/page4": {
    "pageTitle": "Vite + Vue + TS",
    "path": "/page4",
    "startTime": 1690723196840,
    "endTime": 1690723197193,
    "duration": 353
  },
  "/page3": {
    "pageTitle": "Vite + Vue + TS",
    "path": "/page3",
    "startTime": 1690723197193,
    "endTime": 1690723201106,
    "duration": 1937
  }
}
```
中间的加工处理过程是：先把相同页面的记录分到一个组中，然后对每个组进行停留时间累加操作。处理之后的数据的startTime和endTime的含义有所变化，startTime表示第一次进入该页面的时间，endTime表示最后一次离开页面的时间。所以endTime - startTime并不等于用户的停留时间，而是要以duration字段为准，这是准确的。

:::tip
聚合处理过的数据也是最终会上报的数据格式
:::

## 基本原理
同时支持以下两种切换页面的方式
### 以刷新的方式切换页面
这对应着传统多页面应用，这种情况下实现此功能是相对简单的，只需要在用户进入页面做一下记录，再找一个合适的离开时机补充记录
就行了。

切换页面伴随着刷新，所以直接把下一个页面当成一次全新的记录即可。毕竟刷新页面所有的状态都会消失。
### 无刷新切换页面（SPA）
对于SPA项目来说，相对复杂。因为页面之间的跳转是通过history对象和JS来动态实现的，并不会刷新页面。

大多数前端路由库都是使用history对象和地址hash来实现前端路由的，这里介绍以下history对象，他常用的API有：

- history.back()
- history.forward()
- history.go(n)
- history.pushState(state, title, url)
- history.replaceState(state, title, url)

前三个API被调用时，都会触发popstate事件。另外，点击浏览器前进后退按钮也相当于触发了这三个API，hash值的变化也会触发popstate事件

但调用pushState和replaceState并不会触发popstate事件。一般路由库都会调用这两个方法向浏览器的历史栈中
推入新的历史条目和替换当前历史条目。很显然我们希望是能够在调用这两个API之后，能去做一些事情的。

可以想到用装饰者模式去增强这两个API，在保证原有功能的情况下，让他们能触发自定义的事件。这样就能够知道他们在何时被调用了。

```typescript
function wrapReplace(type: 'pushState' | 'replaceState') {
  const origin = window.history[type];
  return function() {
    const result = origin.apply(this, arguments as any);
    const e = new Event(type);
    window.dispatchEvent(e);
    return result;
  };
}

function wrapReplaceHistory() {
  window.history.pushState = wrapReplace('pushState');
  window.history.replaceState = wrapReplace('replaceState');
}
wrapReplaceHistory()
```
然后再去监听这两个事件就可以了
```typescript
// 单页面应用调用pushState时触发
window.addEventListener('pushState', () => {
  // do something
});

// 单页面应用调用pushState时触发
window.addEventListener('replaceState', () => {
  // do something
});
```

::: tip
在线时长数据在[页面卸载时上报](/guide/use/basic#页面卸载时上报)
:::
