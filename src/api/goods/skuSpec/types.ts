export interface SkuSpecVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 乐观锁
   */
  version: number;

  /**
   * 店铺ID
   */
  shopId: string | number;

  /**
   * 类目ID
   */
  categoryId: string | number;

  /**
   * 规格名称
   */
  name: string;

  /**
   * 规格选项JSON
   */
  specJson: string;

  /**
   * 排序
   */
  sortOrder: number;

  /**
   * 状态
   */
  state: string;
}

export interface SkuSpecForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 乐观锁
   */
  version?: number;

  /**
   * 店铺ID
   */
  shopId?: string | number;

  /**
   * 类目ID
   */
  categoryId?: string | number;

  /**
   * 规格名称
   */
  name?: string;

  /**
   * 规格选项JSON
   */
  specJson?: string;

  /**
   * 排序
   */
  sortOrder?: number;

  /**
   * 状态
   */
  state?: string;
}

export interface SkuSpecQuery extends PageQuery {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 店铺ID
   */
  shopId?: string | number;

  /**
   * 类目ID
   */
  categoryId?: string | number;

  /**
   * 规格名称
   */
  name?: string;

  /**
   * 状态
   */
  state?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
