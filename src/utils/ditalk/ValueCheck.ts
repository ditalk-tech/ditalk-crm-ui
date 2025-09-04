/**
 * 类型安全的通用校验工具库
 * 提供基础类型判断、空值校验及深度比较能力
 * @author weidixian
 */

// 基础类型判断
export const isNull = (val: unknown): val is null => val === null;
export const isUndefined = (val: unknown): val is undefined => val === undefined;
export const isNullOrUndefined = (val: unknown): val is null | undefined => isNull(val) || isUndefined(val);

export const isString = (val: unknown): val is string => typeof val === 'string';
export const isNumber = (val: unknown): val is number => typeof val === 'number' && !Number.isNaN(val);
export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean';
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol';
export const isFunction = (val: unknown): val is (...args: any[]) => any => typeof val === 'function';

export const isArray = Array.isArray as <T = unknown>(val: unknown) => val is T[];
export const isObject = (val: unknown): val is object => !isNullOrUndefined(val) && typeof val === 'object' && !isArray(val);

// 特殊类型判断
export const isDate = (val: unknown): val is Date => val instanceof Date;
export const isRegExp = (val: unknown): val is RegExp => val instanceof RegExp;
export const isPromise = <T = unknown>(val: unknown): val is Promise<T> => val instanceof Promise && isFunction((val as Promise<T>).then);

// 空值校验
export const isEmptyString = (val: unknown): val is '' => isString(val) && val.trim() === '';
export const isBlankString = (val: unknown): val is string => isString(val) && val.trim().length === 0;

export const isEmptyArray = <T = unknown>(val: unknown): val is T[] => isArray(val) && val.length === 0;

export const isEmptyObject = (val: unknown): val is Record<string, never> => isObject(val) && Object.keys(val).length === 0;

/**
 * 判断值是否为空（支持所有基础类型）
 * 空值定义：null/undefined/空字符串/空数组/空对象/NaN
 */
export const isEmpty = (val: unknown): boolean => {
  if (isNullOrUndefined(val)) return true;
  if (isString(val)) return val.trim().length === 0;
  if (isArray(val)) return val.length === 0;
  if (isObject(val)) return Object.keys(val).length === 0;
  if (typeof val === 'number') return Number.isNaN(val);
  return false;
};

export const isNotEmpty = (val: unknown): boolean => !isEmpty(val);

// 深度比较工具
const getType = (val: unknown): string => Object.prototype.toString.call(val).slice(8, -1);

/**
 * 深度比较两个值是否完全相等
 * 支持所有基础类型、数组、对象、Date、RegExp等
 */
export const isEqual = (a: unknown, b: unknown): boolean => {
  // 同一引用直接返回true
  if (a === b) return true;

  // 类型不同直接返回false
  if (getType(a) !== getType(b)) return false;

  // 处理日期类型
  if (isDate(a) && isDate(b)) return a.getTime() === b.getTime();

  // 处理正则表达式
  if (isRegExp(a) && isRegExp(b)) {
    return a.source === b.source && a.flags === b.flags && a.lastIndex === b.lastIndex;
  }

  // 处理数组
  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  // 处理对象
  if (isObject(a) && isObject(b)) {
    const keysA = Object.getOwnPropertyNames(a);
    const keysB = Object.getOwnPropertyNames(b);

    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => isEqual(a[key as keyof typeof a], b[key as keyof typeof b]));
  }

  // 其他类型（如NaN等特殊值）
  return false;
};

export default {
  isNull,
  isUndefined,
  isNullOrUndefined,
  isString,
  isNumber,
  isBoolean,
  isSymbol,
  isFunction,
  isArray,
  isObject,
  isDate,
  isRegExp,
  isPromise,
  isEmptyString,
  isBlankString,
  isEmptyArray,
  isEmptyObject,
  isEmpty,
  isNotEmpty,
  isEqual
};
