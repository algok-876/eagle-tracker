export interface Vue {
  config: {
    errorHandler?: any;
    warnHandler?: any;
  };
}

export interface ViewModel {
  _isVue?: boolean;
  __isVue?: boolean;
  $root: ViewModel;
  $parent?: ViewModel;
  $props: { [key: string]: any };
  $options: {
    name?: string;
    propsData?: { [key: string]: any };
    _componentTag?: string;
    __file?: string;
  };
}

export type DeepKeys<T> = T extends any[]
  ? never
  : T extends object ? {
    [K in keyof T]-?: K extends string | number
    ? `${K}` | `${K}.${DeepKeys<T[K]>}`
    : never;
  }[keyof T]
  : never;

export type DeepType<O extends object, T extends string> = T extends `${infer prop}.${infer tail}` | `${infer prop}` ?
  prop extends keyof O ?
  O[prop] extends any[] ?
  O[prop]
  : O[prop] extends object ? DeepType<O[prop], tail> : O[prop]
  : never
  : never
