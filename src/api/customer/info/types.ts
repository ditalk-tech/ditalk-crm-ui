import { InfoForm as ContactForm, InfoVO as ContactInfoVO } from '@/api/contact/info/types';

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
   * 客户名称
   */
  name: string;

  /**
   * 客户类型
   */
  type: string;

  /**
   * 来源渠道
   */
  source: string;

  /**
   * 所属行业
   */
  industry: string;

  /**
   * 客户级别
   */
  tier: string;

  /**
   * 公司官网
   */
  website: string;

  /**
   * 地址
   */
  address: string;

  /**
   * 分配到
   */
  assignedTo: number;

  /**
   * 分配部门
   */
  assignedDept: number;

  /**
   * 备注信息
   */
  remark: string;

  /**
   * 主联系人ID
   */
  contactId: string | number;

  /**
   * 客户状态
   */
  state: string;

  /**
   * 转换时间
   */
  convertedTime: string;

  /**
   * 转换人
   */
  convertedBy: number;

  /**
   * 线索状态
   */
  leadState: string;

  /**
   * 主联系人
   */
  contactInfo: ContactInfoVO;
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
   * 客户名称
   */
  name?: string;

  /**
   * 客户类型
   */
  type?: string;

  /**
   * 来源渠道
   */
  source?: string;

  /**
   * 所属行业
   */
  industry?: string;

  /**
   * 客户级别
   */
  tier?: string;

  /**
   * 公司官网
   */
  website?: string;

  /**
   * 地址
   */
  address?: string;

  /**
   * 分配到
   */
  assignedTo?: number;

  /**
   * 分配部门
   */
  assignedDept?: number;

  /**
   * 备注信息
   */
  remark?: string;

  /**
   * 主联系人ID
   */
  contactId?: string | number;

  /**
   * 客户状态
   */
  state?: string;

  /**
   * 转换时间
   */
  convertedTime?: string;

  /**
   * 转换人
   */
  convertedBy?: number;

  /**
   * 线索状态
   */
  leadState?: string;
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
   * 客户名称
   */
  name?: string;

  /**
   * 客户类型
   */
  type?: string;

  /**
   * 来源渠道
   */
  source?: string;

  /**
   * 所属行业
   */
  industry?: string;

  /**
   * 客户级别
   */
  tier?: string;

  /**
   * 地址
   */
  address?: string;

  /**
   * 分配到
   */
  assignedTo?: number;

  /**
   * 分配部门
   */
  assignedDept?: number;

  /**
   * 主联系人ID
   */
  contactId?: string | number;

  /**
   * 客户状态
   */
  state?: string;

  /**
   * 转换时间
   */
  convertedTime?: string;

  /**
   * 转换人
   */
  convertedBy?: number;

  /**
   * 线索状态
   */
  leadState?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

export interface InfoOptionVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 客户名称
   */
  name: string;

  /**
   * 客户类型
   */
  type: string;

  /**
   * 客户状态
   */
  state: string;

  /**
   * 主联系人ID
   */
  contactId: string | number;
}

export interface CustomerContactForm {
  customerInfoBo?: InfoForm;
  contactInfoBo?: ContactForm;
}
