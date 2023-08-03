/**
 * 通过路径深度获取一个对象中某个key的值
 * @param data 对象
 * @param path 获取路径，以点分割
 * @param defaultValue 不存在时的默认值
 * @returns path所对应的值
 */
export function get<TData, TPath extends string>(data: TData, path: TPath, defaultValue?: any) {
  const paths = path.split('.');
  if (paths.length === 1) {
    return data[paths[0]] === undefined ? defaultValue : data[paths[0]];
  }
  return get(data[paths[0]], paths.slice(1).join('.'), defaultValue);
}

const isObject = (obj: any) => typeof obj === 'object' && obj !== null;

/**
 * 深度合并两个对象
 * @param object 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
export function merge<TObject extends object,
  TSource extends object>(object: TObject, source: TSource) {
  const result = {} as TObject & TSource;
  const keys = Object.keys(object);
  Object.keys(source).forEach((key) => {
    if (!keys.includes(key)) {
      keys.push(key);
    }
  });

  keys.forEach((key) => {
    if (object[key] !== undefined && source[key] !== undefined) {
      if (isObject(object[key]) && isObject(source[key])) {
        result[key] = merge(object[key], source[key]);
      } else {
        result[key] = source[key];
      }
    } else if (object[key] !== undefined) {
      result[key] = object[key];
    } else {
      result[key] = source[key];
    }
  });
  return result;
}

/**
 * 深拷贝
 * @param object 源对象
 * @returns 深拷贝后的对象
 */
export function cloneDeep<T extends object>(object: T): T {
  if (object.constructor === Date) {
    return new Date(object as Date) as T;
  }
  if (object.constructor === RegExp) {
    return new RegExp(object as RegExp) as T;
  }
  const allDesc = Object.getOwnPropertyDescriptors(object);
  const cloneObj = Object.create(Object.getPrototypeOf(object), allDesc);
  Reflect.ownKeys(object).forEach((key) => {
    if (isObject(object[key])) {
      cloneObj[key] = cloneDeep(object[key]);
    } else {
      cloneObj[key] = object[key];
    }
  });
  return cloneObj;
}
