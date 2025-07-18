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
   * 客户ID
   */
  customerId: string | number;

  /**
   * 姓氏
   */
  lastName: string;

  /**
   * 名称
   */
  firstName: string;

  /**
   * 头像
   */
  avatar: number;

  /**
   * 头像Url
   */
  avatarUrl: string;
  /**
   * 姓名拼音
   */
  pinyin: string;

  /**
   * 性别
   */
  gender: string;

  /**
   * 电子邮箱
   */
  email: string;

  /**
   * 联系电话
   */
  phone: string;

  /**
   * 职位
   */
  position: string;

  /**
   * 备注信息
   */
  remark: string;

  /**
   * 生日
   */
  birthday: string;

  /**
   * 户籍
   */
  placeOfOrigin: string;

  /**
   * 居住地
   */
  address: string;

  /**
   * 毕业学校
   */
  graduationSchool: string;

  /**
   * 学历
   */
  qualification: string;

  /**
   * 社会角色
   */
  socialRole: string;

  /**
   * 最近接触时间
   */
  lastContactTime: string;

  /**
   * 接触频率
   */
  contactFrequency: string;

  /**
   * 微信
   */
  wechat: string;

  /**
   * QQ
   */
  qq: string;

  /**
   * 钉钉
   */
  dingTalk: string;

  /**
   * 飞书
   */
  lark: string;

  /**
   * WhatsApp
   */
  whatsApp: string;

  /**
   * Facebook
   */
  facebook: string;

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
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 姓氏
   */
  lastName?: string;

  /**
   * 名称
   */
  firstName?: string;

  /**
   * 头像
   */
  avatar?: number;

  /**
   * 姓名拼音
   */
  pinyin?: string;

  /**
   * 性别
   */
  gender?: string;

  /**
   * 电子邮箱
   */
  email?: string;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 职位
   */
  position?: string;

  /**
   * 备注信息
   */
  remark?: string;

  /**
   * 生日
   */
  birthday?: string;

  /**
   * 户籍
   */
  placeOfOrigin?: string;

  /**
   * 居住地
   */
  address?: string;

  /**
   * 毕业学校
   */
  graduationSchool?: string;

  /**
   * 学历
   */
  qualification?: string;

  /**
   * 社会角色
   */
  socialRole?: string;

  /**
   * 最近接触时间
   */
  lastContactTime?: string;

  /**
   * 接触频率
   */
  contactFrequency?: string;

  /**
   * 微信
   */
  wechat?: string;

  /**
   * QQ
   */
  qq?: string;

  /**
   * 钉钉
   */
  dingTalk?: string;

  /**
   * 飞书
   */
  lark?: string;

  /**
   * WhatsApp
   */
  whatsApp?: string;

  /**
   * Facebook
   */
  facebook?: string;

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
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 姓氏
   */
  lastName?: string;

  /**
   * 名称
   */
  firstName?: string;

  /**
   * 姓名拼音
   */
  pinyin?: string;

  /**
   * 性别
   */
  gender?: string;

  /**
   * 电子邮箱
   */
  email?: string;

  /**
   * 联系电话
   */
  phone?: string;

  /**
   * 职位
   */
  position?: string;

  /**
   * 生日
   */
  birthday?: string;

  /**
   * 户籍
   */
  placeOfOrigin?: string;

  /**
   * 居住地
   */
  address?: string;

  /**
   * 毕业学校
   */
  graduationSchool?: string;

  /**
   * 学历
   */
  qualification?: string;

  /**
   * 社会角色
   */
  socialRole?: string;

  /**
   * 最近接触时间
   */
  lastContactTime?: string;

  /**
   * 接触频率
   */
  contactFrequency?: string;

  /**
   * 微信
   */
  wechat?: string;

  /**
   * QQ
   */
  qq?: string;

  /**
   * 钉钉
   */
  dingTalk?: string;

  /**
   * 飞书
   */
  lark?: string;

  /**
   * WhatsApp
   */
  whatsApp?: string;

  /**
   * Facebook
   */
  facebook?: string;

  /**
   * 状态
   */
  state?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}



