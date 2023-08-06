export function getStartName(name: string) {
  return `${name}-mark-start`;
}

export function getEndName(name: string) {
  return `${name}-mark-end`;
}

export function getMeasureName(name: string) {
  return `${name}-duration`;
}

export function markStart(name: string) {
  performance.mark(getStartName(name));
}

export function markEnd(name: string) {
  performance.mark(getEndName(name));
}

export function measure(name: string) {
  performance.measure(`${name}-duration`, getStartName(name), getEndName(name));
}
