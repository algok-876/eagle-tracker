import {
  AfterSendDataLifeCycleCallback,
  BeforeSendDataLifeCycleCallback,
  ConfigLifeCycleCallback,
  ErrorLifeCycleCallback,
  LifeCycleName,
  RSErrorLifeCycleCallback,
} from '@eagle-tracker/types';

export type RegParamterMapping = {
  [LifeCycleName.ERROR]: ErrorLifeCycleCallback
  [LifeCycleName.CONFIG]: ConfigLifeCycleCallback
  [LifeCycleName.ASEND]: AfterSendDataLifeCycleCallback
  [LifeCycleName.BSEND]: BeforeSendDataLifeCycleCallback
  [LifeCycleName.RSERROR]: RSErrorLifeCycleCallback
}

export type RunParamterMapping = {
  [K in keyof RegParamterMapping]: Parameters<RegParamterMapping[K]>
}
