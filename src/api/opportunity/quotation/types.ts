export interface QuotationVO {
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
   * 商机ID
   */
  opportunityId: string | number;

  /**
   * 客户ID
   */
  customerId: string | number;

  /**
   * 联系人ID
   */
  contactId: string | number;

  /**
   * 编号
   */
  code: string;

  /**
   * 总售价
   */
  totalSalePrice: number | string;

  /**
   * 总定价
   */
  totalOriginalPrice: number | string;

  /**
   * 总成本
   */
  totalCostPrice: number | string;

  /**
   * 有效期到
   */
  validUntil: string | number;

  /**
   * 分派给
   */
  assignedTo: number;

  /**
   * 分派部门
   */
  assignedDept: number;

  /**
   * 审批状态
   */
  approvalState: string;

  /**
   * 交互状态
   */
  quotationState: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 引用状态
   */
  quoted: string;
}

export interface QuotationForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 乐观锁
   */
  version?: number;

  /**
   * 商机ID
   */
  opportunityId?: string | number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 联系人ID
   */
  contactId?: string | number;

  /**
   * 编号
   */
  code?: string;

  /**
   * 总售价
   */
  totalSalePrice?: number;

  /**
   * 总定价
   */
  totalOriginalPrice?: number;

  /**
   * 总成本
   */
  totalCostPrice?: number;

  /**
   * 有效期到
   */
  validUntil?: string | number;

  /**
   * 分派给
   */
  assignedTo?: number;

  /**
   * 分派部门
   */
  assignedDept?: number;

  /**
   * 审批状态
   */
  approvalState?: string;

  /**
   * 交互状态
   */
  quotationState?: string;

  /**
   * 备注
   */
  remark?: string;

  /**
   * 引用状态
   */
  quoted?: string;
}

export interface QuotationQuery extends PageQuery {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 商机ID
   */
  opportunityId?: string | number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 联系人ID
   */
  contactId?: string | number;

  /**
   * 编号
   */
  code?: string;

  /**
   * 有效期到
   */
  validUntil?: string | number;

  /**
   * 分派给
   */
  assignedTo?: number;

  /**
   * 分派部门
   */
  assignedDept?: number;

  /**
   * 审批状态
   */
  approvalState?: string;

  /**
   * 交互状态
   */
  quotationState?: string;

  /**
   * 引用状态
   */
  quoted?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
