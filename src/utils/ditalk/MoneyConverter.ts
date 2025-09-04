/**
 * 金额转换工具类
 * 用于处理long类型金额与带小数位金额之间的相互转换
 * 采用金融进位算法（四舍五入），不使用千位分隔符
 * @author weidixian
 */
class MoneyConverter {
  /**
   * 将long类型金额转换为带小数位的金额字符串
   * @param amount 以long类型表示的金额（无小数位）
   * @param decimalPlaces 小数位数，默认2位
   * @returns 带小数位的金额字符串
   */
  static longToAmount(amount: number, decimalPlaces: number = 2): string {
    // 验证输入
    if (!Number.isInteger(amount)) {
      throw new Error('金额必须是整数（long类型）');
    }
    if (decimalPlaces < 0 || !Number.isInteger(decimalPlaces)) {
      throw new Error('小数位数必须是非负整数');
    }

    // 处理0的情况
    if (amount === 0) {
      return `0.${'0'.repeat(decimalPlaces)}`;
    }

    // 处理负数
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const amountStr = absAmount.toString();

    // 计算整数部分和小数部分
    let integerPart: string;
    let fractionalPart: string;

    if (amountStr.length <= decimalPlaces) {
      // 整数部分为0的情况
      integerPart = '0';
      // 小数部分前面补0
      fractionalPart = amountStr.padStart(decimalPlaces, '0');
    } else {
      // 分割整数和小数部分
      const splitIndex = amountStr.length - decimalPlaces;
      integerPart = amountStr.substring(0, splitIndex);
      fractionalPart = amountStr.substring(splitIndex);
    }

    // 组合结果，添加负号（如果需要）
    const result = `${isNegative ? '-' : ''}${integerPart}.${fractionalPart}`;

    return result;
  }

  /**
   * 将带小数位的金额字符串转换为long类型（用于存储）
   * 采用金融进位算法（四舍五入）
   * @param amountStr 带小数位的金额字符串
   * @param decimalPlaces 小数位数，默认2位
   * @returns 转换后的long类型金额
   */
  static amountToLong(amountStr: string, decimalPlaces: number = 2): number {
    // 验证输入
    if (typeof amountStr !== 'string' || amountStr.trim() === '') {
      throw new Error('金额字符串不能为空');
    }
    if (decimalPlaces < 0 || !Number.isInteger(decimalPlaces)) {
      throw new Error('小数位数必须是非负整数');
    }

    // 移除任何可能存在的千位分隔符
    const cleanedStr = amountStr.replace(/,/g, '').trim();

    // 验证金额格式
    const amountRegex = /^[-+]?\d+(\.\d+)?$/;
    if (!amountRegex.test(cleanedStr)) {
      throw new Error('无效的金额格式');
    }

    // 处理负数标记
    const isNegative = cleanedStr.startsWith('-');
    const absoluteStr = isNegative ? cleanedStr.slice(1) : cleanedStr;

    // 分割整数和小数部分
    const parts = absoluteStr.split('.');
    let integerPart = parts[0] || '0';
    let fractionalPart = parts[1] || '';

    // 金融进位算法实现
    if (fractionalPart.length > decimalPlaces) {
      // 截取到指定小数位，并获取进位判断位
      const roundDigit = parseInt(fractionalPart[decimalPlaces], 10);
      fractionalPart = fractionalPart.substring(0, decimalPlaces);

      // 四舍五入判断
      if (roundDigit >= 5) {
        // 转换为数字进行进位计算（金融进位核心）
        let total = BigInt(integerPart) * 10n ** BigInt(decimalPlaces) + BigInt(fractionalPart);
        total += 1n; // 进位

        // 转换回字符串处理
        const totalStr = total.toString();
        if (totalStr.length <= decimalPlaces) {
          integerPart = '0';
          fractionalPart = totalStr.padStart(decimalPlaces, '0');
        } else {
          const splitIndex = totalStr.length - decimalPlaces;
          integerPart = totalStr.substring(0, splitIndex);
          fractionalPart = totalStr.substring(splitIndex);
        }
      }
    } else {
      // 小数部分过短，补0
      fractionalPart = fractionalPart.padEnd(decimalPlaces, '0');
    }

    // 组合成long类型的字符串
    const longStr = integerPart + fractionalPart;

    // 转换为数字并返回，恢复负数标记
    const result = BigInt(longStr);
    return Number(isNegative ? -result : result);
  }
}

export default MoneyConverter;
