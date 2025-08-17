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
   * 编号
   */
  code: string;

  /**
   * 标题
   */
  title: string;

  /**
   * 客户ID
   */
  customerId: string | number;

  /**
   * 联系人ID
   */
  contactId: string | number;

  /**
   * 商机ID
   */
  opportunityId: string | number;

  /**
   * 签约日期
   */
  signDate: string;

  /**
   * 开始日期
   */
  startDate: string;

  /**
   * 结束日期
   */
  endDate: string;

  /**
   * 含税总额
   */
  totalAmount: number;

  /**
   * 税费金额
   */
  taxAmount: number;

  /**
   * 备注说明
   */
  remark: string;

  /**
   * 指派给
   */
  assignedTo: number;

  /**
   * 指派部门
   */
  assignedDept: number;

  /**
   * 附件
   */
  terms: string;

  /**
   * 状态
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
   * 编号
   */
  code?: string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 联系人ID
   */
  contactId?: string | number;

  /**
   * 商机ID
   */
  opportunityId?: string | number;

  /**
   * 签约日期
   */
  signDate?: string;

  /**
   * 开始日期
   */
  startDate?: string;

  /**
   * 结束日期
   */
  endDate?: string;

  /**
   * 含税总额
   */
  totalAmount?: number;

  /**
   * 税费金额
   */
  taxAmount?: number;

  /**
   * 备注说明
   */
  remark?: string;

  /**
   * 指派给
   */
  assignedTo?: number;

  /**
   * 指派部门
   */
  assignedDept?: number;

  /**
   * 附件
   */
  terms?: string;

  /**
   * 状态
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
   * 编号
   */
  code?: string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 联系人ID
   */
  contactId?: string | number;

  /**
   * 商机ID
   */
  opportunityId?: string | number;

  /**
   * 签约日期
   */
  signDate?: string;

  /**
   * 开始日期
   */
  startDate?: string;

  /**
   * 结束日期
   */
  endDate?: string;

  /**
   * 指派给
   */
  assignedTo?: number;

  /**
   * 指派部门
   */
  assignedDept?: number;

  /**
   * 状态
   */
  state?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
