# 类型保护
在 [TS数据类型](/guide/use/type) 一节中存在部分联合类型，这些联合类型在业务中可能会使用到并且可能有需要缩小类型范围的需求，故提供一些类型守卫供开发者使用。

## 辨析类型 [IErrorLog](/guide/use/type#ierrorlog)

- isVueError
- isJSError
- isHttpError
- isPromiseError

### 使用
```typescript{9}
import { 
  isVueError, 
  isJSError, 
  isHttpError,
  isPromiseError 
} from '@eagle-tracker/vue3'

useCatchError((type, log) => {
  if (isVueError(log)) {
    console.log(type, log)
  }
})
```