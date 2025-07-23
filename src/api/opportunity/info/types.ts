export interface InfoVO {
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
   * 商机标题
   */
  title: string;

  /**
   * 客户ID
   */
  customerId: string | number;

  /**
   * 预计销售金额
   */
  amount: number;

  /**
   * 指派给
   */
  assignedTo: number;

  /**
   * 订单ID
   */
  orderId: string | number;

  /**
   * 备注信息
   */
  remark: string;

  /**
   * 预计成交日期
   */
  closeDate: string;

  /**
   * 商机阶段
   */
  state: string;
}

export interface InfoForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 乐观锁
   */
  version?: number;

  /**
   * 商机标题
   */
  title?: string;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 预计销售金额
   */
  amount?: number;

  /**
   * 指派给
   */
  assignedTo?: number;

  /**
   * 订单ID
   */
  orderId?: string | number;

  /**
   * 备注信息
   */
  remark?: string;

  /**
   * 预计成交日期
   */
  closeDate?: string;

  /**
   * 商机阶段
   */
  state?: string;
}

export interface InfoQuery extends PageQuery {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 商机标题
   */
  title?: string;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 指派给
   */
  assignedTo?: number;

  /**
   * 订单ID
   */
  orderId?: string | number;

  /**
   * 预计成交日期
   */
  closeDate?: string;

  /**
   * 商机阶段
   */
  state?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
