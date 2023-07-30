export default function groupBy<T extends object>(data: T[], key: keyof T) {
  const result: Record<string, T[]> = {} as Record<string, T[]>;
  Object.keys(data).forEach((index) => {
    if (result[data[index][key]]) {
      result[data[index][key]].push(data[index]);
    } else {
      result[data[index][key]] = [data[index]];
    }
  });
  return result;
}
