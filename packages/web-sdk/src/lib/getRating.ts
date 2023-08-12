/**
 * 计算性能评分
 * @param value 性能值
 * @param range 区间范围
 * @returns 评分结果
 */
export function getRating(value: number, range: [number, number]) {
  if (value > range[1]) {
    return 'poor';
  }
  if (value > range[0]) {
    return 'needs-improvement';
  }
  return 'good';
}
