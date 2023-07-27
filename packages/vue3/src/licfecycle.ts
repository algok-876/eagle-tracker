import {
  ErrorLifeCycleCallback,
  BeforeSendDataLifeCycleCallback,
  AfterSendDataLifeCycleCallback,
  RSErrorLifeCycleCallback,
} from '@eagle-tracker/core';
import eagle from './eagle';

export function useCatchError(cb: ErrorLifeCycleCallback) {
  eagle.onCatchError(cb);
}

export function useBeforeSendData(cb: BeforeSendDataLifeCycleCallback) {
  eagle.beforeSendData(cb);
}

export function useAfterSendData(cb: AfterSendDataLifeCycleCallback) {
  eagle.afterSendData(cb);
}

export function useCatchRSError(cb: RSErrorLifeCycleCallback) {
  eagle.onCatchRSError(cb);
}
