function wrapReplace(type: 'pushState' | 'replaceState') {
  const origin = window.history[type];
  return function name() {
    const result = origin.apply(this, arguments as any);
    const e = new Event(type);
    window.dispatchEvent(e);
    return result;
  };
}

export default function wrapReplaceHistory() {
  window.history.pushState = wrapReplace('pushState');
  window.history.replaceState = wrapReplace('replaceState');
}
