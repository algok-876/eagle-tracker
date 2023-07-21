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
