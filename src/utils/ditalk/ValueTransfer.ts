/**
 * 将源对象中与目标对象同名的属性值复制到目标对象
 * @param source 源对象，提供属性值
 * @param target 目标对象，接收属性值
 * @param options 可选配置项
 * @returns 更新后的目标对象
 */
export const copyValues = <T extends Record<string, any>, S extends Partial<T>>(
  source: S,
  target: T,
  options: {
    // 是否覆盖目标对象中已有的值
    overwriteExisting?: boolean;
    // 仅复制这些指定的属性
    includeOnly?: (keyof S & keyof T)[];
    // 排除这些属性不复制
    exclude?: (keyof S & keyof T)[];
  } = {}
): T => {
  // 默认配置
  const { overwriteExisting = true, includeOnly = [], exclude = [] } = options;

  // 获取源对象和目标对象共有的属性名
  const sourceKeys = Object.keys(source);
  const targetKeys = new Set(Object.keys(target));

  // 找出共同属性（字符串层面）
  let commonKeys = sourceKeys.filter((key) => targetKeys.has(key));

  // 应用包含过滤
  if (includeOnly.length > 0) {
    const includeSet = new Set(includeOnly as string[]);
    commonKeys = commonKeys.filter((key) => includeSet.has(key));
  }

  // 应用排除过滤
  if (exclude.length > 0) {
    const excludeSet = new Set(exclude as string[]);
    commonKeys = commonKeys.filter((key) => !excludeSet.has(key));
  }

  // 复制属性值
  commonKeys.forEach((key) => {
    const typedKey = key as keyof T;
    // 如果不允许覆盖且目标对象已有值，则跳过
    if (!overwriteExisting && target[typedKey] !== undefined) {
      return;
    }

    // 安全赋值：先转为 unknown 再转为目标类型
    target[typedKey] = source[typedKey] as unknown as T[typeof typedKey];
  });

  return target;
};
