export interface TransferLogVO {
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
   * 客户ID
   */
  customerId: string | number;

  /**
   * 原用户ID
   */
  oldUserId: string | number;

  /**
   * 原部门ID
   */
  oldDeptId: string | number;

  /**
   * 新用户ID
   */
  newUserId: string | number;

  /**
   * 新部门ID
   */
  newDeptId: string | number;

  /**
   * 状态
   */
  state: string;
}

export interface TransferLogForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 乐观锁
   */
  version?: number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 原用户ID
   */
  oldUserId?: string | number;

  /**
   * 原部门ID
   */
  oldDeptId?: string | number;

  /**
   * 新用户ID
   */
  newUserId?: string | number;

  /**
   * 新部门ID
   */
  newDeptId?: string | number;

  /**
   * 状态
   */
  state?: string;
}

export interface TransferLogQuery extends PageQuery {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 原用户ID
   */
  oldUserId?: string | number;

  /**
   * 原部门ID
   */
  oldDeptId?: string | number;

  /**
   * 新用户ID
   */
  newUserId?: string | number;

  /**
   * 新部门ID
   */
  newDeptId?: string | number;

  /**
   * 状态
   */
  state?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
