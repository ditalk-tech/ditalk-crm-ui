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
   * 名称
   */
  name: string;

  /**
   * 商标
   */
  logo: number;

  /**
   * 商标Url
   */
  logoUrl: string;
  /**
   * 主图
   */
  mainPic: number;

  /**
   * 主图Url
   */
  mainPicUrl: string;
  /**
   * 店铺评分
   */
  rating: number;

  /**
   * 店铺状态
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
   * 名称
   */
  name?: string;

  /**
   * 商标
   */
  logo?: number;

  /**
   * 主图
   */
  mainPic?: number;

  /**
   * 店铺评分
   */
  rating?: number;

  /**
   * 店铺状态
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
   * 名称
   */
  name?: string;

  /**
   * 店铺评分
   */
  rating?: number;

  /**
   * 店铺状态
   */
  state?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



