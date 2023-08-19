export function isRegexpArray(target: any[]): target is RegExp[] {
  const first = target[0];
  if (first) {
    return first instanceof RegExp;
  }
  return false;
}

export function ignoreWithRegexp(target: string, conditions: RegExp[]) {
  return conditions.some((reg) => reg.test(target));
}

export function ignoreWithFunction<T>(target: T, conditions: Array<(info: T) => boolean>) {
  try {
    return conditions.some((fn) => fn(target));
  } catch {
    return false;
  }
}
