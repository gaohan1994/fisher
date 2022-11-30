/**
 * 随机获取
 * @param items
 * @returns
 */
export const randomPick = <T>(items: Array<T>): T =>
  items[Math.floor(Math.random() * items.length)];

/**
 * 日志级别优先级
 * @param LoggerLevelPriority
 */
export enum LoggerLevelPriority {
  off = 0,
  error = 1,
  info = 3,
  debug = 4,
}
