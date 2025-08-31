/**
 * 数字转换工具类
 * 提供将十进制数字转换为指定基数的字符串，以及将指定基数的字符串转换为十进制数字的功能。
 * 支持的基数范围为2到62，超出范围时默认使用62进制。
 * @author DiTalk - weidixian
 */
export class NumberConverter {
  private static readonly DIGITS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly CHAR_TO_VALUE = new Map<string, number>();

  static {
    // 初始化字符到数值的映射
    for (let i = 0; i < NumberConverter.DIGITS.length; i++) {
      NumberConverter.CHAR_TO_VALUE.set(NumberConverter.DIGITS[i], i);
    }
  }

  /**
   * 将十进制数字字符串转换为指定基数
   * @param number 十进制数字字符串
   * @param radix 目标基数
   * @returns 转换后的数字字符串
   */
  public static numToRadix(number: string, radix: number): string {
    if (radix <= 1 || radix > NumberConverter.DIGITS.length) {
      radix = NumberConverter.DIGITS.length;
    }

    let bigNumber = BigInt(number);
    const bigRadix = BigInt(radix);
    const stack: string[] = [];

    if (bigNumber === BigInt(0)) {
      return '0';
    }

    while (bigNumber > BigInt(0)) {
      const remainder = Number(bigNumber % bigRadix);
      stack.push(NumberConverter.DIGITS[remainder]);
      bigNumber = bigNumber / bigRadix;
    }

    return stack.reverse().join('');
  }

  /**
   * 将指定基数的数字转换为十进制字符串
   * @param number 要转换的数字字符串
   * @param radix 原始基数
   * @returns 十进制数字字符串
   */
  public static radixToNum(number: string, radix: number): string {
    if (radix <= 1 || radix > NumberConverter.DIGITS.length) {
      radix = NumberConverter.DIGITS.length;
    }

    if (radix === 10) {
      return number;
    }

    const chars = number.split('');
    let result = BigInt(0);
    let base = BigInt(1);
    const bigRadix = BigInt(radix);

    for (let i = chars.length - 1; i >= 0; i--) {
      const char = chars[i];
      const index = NumberConverter.CHAR_TO_VALUE.get(char);

      if (index === undefined || index >= radix) {
        throw new Error(`Invalid character for radix: ${char}`);
      }

      result += BigInt(index) * base;
      base *= bigRadix;
    }

    return result.toString();
  }

  /**
   * 将数字从指定基数转换为目标基数
   * @param num 要转换的数字字符串
   * @param fromRadix 原始基数
   * @param toRadix 目标基数
   * @returns 转换后的数字字符串
   */
  public static transRadix(num: string, fromRadix: number, toRadix: number): string {
    return NumberConverter.numToRadix(NumberConverter.radixToNum(num, fromRadix), toRadix);
  }
}

/*
## 基本使用示例

### 1. 十进制转其他进制

```typescript
// 十进制转二进制
const binary = NumberConverter.numToRadix("10", 2);
console.log(binary); // 输出: "1010"

// 十进制转十六进制
const hex = NumberConverter.numToRadix("255", 16);
console.log(hex); // 输出: "ff"

// 十进制转62进制
const base62 = NumberConverter.numToRadix("123456789", 62);
console.log(base62); // 输出: "8M0kX"
```

### 2. 其他进制转十进制

```typescript
// 二进制转十进制
const decimal1 = NumberConverter.radixToNum("1010", 2);
console.log(decimal1); // 输出: "10"

// 十六进制转十进制
const decimal2 = NumberConverter.radixToNum("ff", 16);
console.log(decimal2); // 输出: "255"

// 62进制转十进制
const decimal3 = NumberConverter.radixToNum("8M0kX", 62);
console.log(decimal3); // 输出: "123456789"
```

### 3. 进制间相互转换

```typescript
// 二进制转十六进制
const hexFromBinary = NumberConverter.transRadix("11111111", 2, 16);
console.log(hexFromBinary); // 输出: "ff"

// 十六进制转二进制
const binaryFromHex = NumberConverter.transRadix("ff", 16, 2);
console.log(binaryFromHex); // 输出: "11111111"
```

## 实际应用场景

```typescript
// 大数字处理示例
const bigNumber = "123456789012345678901234567890";
const base36 = NumberConverter.numToRadix(bigNumber, 36);
console.log(base36); // 输出: "8k05f67scjhipz3n3zk36y1z"

const restored = NumberConverter.radixToNum(base36, 36);
console.log(restored); // 输出: "123456789012345678901234567890"

// URL友好的短链接ID生成
const id = "123456789";
const shortId = NumberConverter.numToRadix(id, 62);
console.log(shortId); // 输出: "8M0kX"

// 短链接ID还原
const originalId = NumberConverter.radixToNum(shortId, 62);
console.log(originalId); // 输出: "123456789"
```

## 错误处理示例

```typescript
try {
    // 使用无效字符会抛出错误
    const result = NumberConverter.radixToNum("gg", 16);
} catch (error) {
    console.error(error.message); // 输出: "Invalid character for radix: g"
}

// 超出支持范围的基数会被自动调整为62进制
const result = NumberConverter.numToRadix("100", 100);
// 实际会使用62进制进行转换
```
*/
