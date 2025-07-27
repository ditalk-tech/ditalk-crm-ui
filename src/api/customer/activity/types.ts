export interface ActivityVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 创建人ID
   */
  createBy: string | number;

  /**
   * 乐观锁
   */
  version: number;

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
   * 活动类型
   */
  type: string;

  /**
   * 主题
   */
  subject: string;

  /**
   * 描述内容
   */
  description: string;

  /**
   * 活动时间
   */
  activityTime: string;
}

export interface ActivityForm extends BaseEntity {
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
   * 联系人ID
   */
  contactId?: string | number;

  /**
   * 商机ID
   */
  opportunityId?: string | number;

  /**
   * 活动类型
   */
  type?: string;

  /**
   * 主题
   */
  subject?: string;

  /**
   * 描述内容
   */
  description?: string;

  /**
   * 活动时间
   */
  activityTime?: string;
}

export interface ActivityQuery extends PageQuery {
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
   * 联系人ID
   */
  contactId?: string | number;

  /**
   * 商机ID
   */
  opportunityId?: string | number;

  /**
   * 活动类型
   */
  type?: string;

  /**
   * 主题
   */
  subject?: string;

  /**
   * 描述内容
   */
  description?: string;

  /**
   * 活动时间
   */
  activityTime?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
