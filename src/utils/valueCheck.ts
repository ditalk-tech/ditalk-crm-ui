/**
 * @author weidixian
 * 常用校验工具
 */

/** */
export const isNullOrUndefined = (val: any): val is null | undefined => val === null || val === undefined;

export const isEmptyStr = (val: any): boolean => isNullOrUndefined(val) || (typeof val === 'string' && val.trim() === '');

export const hasText = (val: any): val is string => typeof val === 'string' && val.trim().length > 0;

export const isEmptyArr = (val: any): boolean => isNullOrUndefined(val) || !Array.isArray(val) || val.length === 0;

export const hasItems = (val: any): val is any[] => Array.isArray(val) && val.length > 0;

export const isEmptyObj = (val: any): boolean =>
  isNullOrUndefined(val) || typeof val !== 'object' || Array.isArray(val) || Object.keys(val).length === 0;

export const hasProps = (val: any): val is Record<string, any> =>
  typeof val === 'object' && !isNullOrUndefined(val) && !Array.isArray(val) && Object.keys(val).length > 0;

export const isEmptyValue = (val: any): boolean => isEmptyStr(val) || isEmptyArr(val) || isEmptyObj(val) || isNullOrUndefined(val);

export const isValidValue = (val: any): boolean => !isEmptyValue(val);

/**
 * 深度比较两个对象是否相等（忽略属性顺序）
 * @param obj1 - 第一个对象
 * @param obj2 - 第二个对象
 * @returns 如果两个对象的属性完全相同（忽略顺序），返回 true；否则返回 false
 */
export const isEqualObject = (obj1: any, obj2: any): boolean => {
  // 检查是否为同一引用或原始值
  if (obj1 === obj2) {
    return true;
  }
  // 检查是否为对象
  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
    return false;
  }
  // 获取所有属性键（包括可枚举和不可枚举，但不包括 Symbol）
  const keys1 = Object.getOwnPropertyNames(obj1);
  const keys2 = Object.getOwnPropertyNames(obj2);
  // 检查属性数量是否相同
  if (keys1.length !== keys2.length) {
    return false;
  }
  // 检查所有属性值是否相同（忽略顺序）
  for (const key of keys1) {
    if (!obj2.hasOwnProperty(key)) {
      return false; // 存在不同的属性
    }
    // 递归比较属性值
    if (!isEqualObject(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
};
