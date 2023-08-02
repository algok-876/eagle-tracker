# 单例模式

`EagleTracker`是单例模式的类，多次实例化的对象是一致的，并不会创建新的对象，这样
做的目的是为了防止多次实例化，导致对错误，性能数据的重复处理。  

下面的例子说明了这种情况：

```javascript
const instance1 = new EagleTracker()
const instance2 = new EagleTracker()
console.log(instance1 === instance2)  // true
```

打印的结果为true说明是同一个对象。

::: warning
值得注意的是，多次实例化虽然不会产生不同的对象，但是如果传入了配置项，会发生配置覆盖合并的情况。
:::

::: tip
如果你是Vue用户，则不必关注上述情况，因为Vue不允许重复安装同一个插件。
:::