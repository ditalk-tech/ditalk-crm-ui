export interface BrandVO {
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
   * 名称
   */
  name: string;

  /**
   * 英文名称
   */
  englishName: string;

  /**
   * Logo
   */
  logo: number;

  /**
   * LogoUrl
   */
  logoUrl: string;
  /**
   * 描述
   */
  description: string;

  /**
   * 所属国家
   */
  country: string;

  /**
   * 官网
   */
  website: string;

  /**
   * 排序
   */
  sortOrder: number;

  /**
   * 状态
   */
  state: string;

}

export interface BrandForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 乐观锁
   */
  version?: number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 英文名称
   */
  englishName?: string;

  /**
   * Logo
   */
  logo?: number;

  /**
   * 描述
   */
  description?: string;

  /**
   * 所属国家
   */
  country?: string;

  /**
   * 官网
   */
  website?: string;

  /**
   * 排序
   */
  sortOrder?: number;

  /**
   * 状态
   */
  state?: string;

}

export interface BrandQuery extends PageQuery {

  /**
   * ID
   */
  id?: string | number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 名称
   */
  name?: string;

  /**
   * 英文名称
   */
  englishName?: string;

  /**
   * 所属国家
   */
  country?: string;

  /**
   * 官网
   */
  website?: string;

  /**
   * 状态
   */
  state?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



