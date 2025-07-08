export interface CategoryVO {
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
   * 父类ID
   */
  parentId: string | number;

  /**
   * 祖级列表
   */
  ancestors: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 主图
   */
  mainPic: number;

  /**
   * 主图Url
   */
  mainPicUrl: string;
  /**
   * 排序
   */
  sortOrder: number;

  /**
   * 状态
   */
  state: string;

    /**
     * 子对象
     */
    children: CategoryVO[];
}

export interface CategoryForm extends BaseEntity {
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
   * 父类ID
   */
  parentId?: string | number;

  /**
   * 祖级列表
   */
  ancestors?: string;

  /**
   * 名称
   */
  name?: string;

  /**
   * 主图
   */
  mainPic?: number;

  /**
   * 排序
   */
  sortOrder?: number;

  /**
   * 状态
   */
  state?: string;

}

export interface CategoryQuery {

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
   * 父类ID
   */
  parentId?: string | number;

  /**
   * 祖级列表
   */
  ancestors?: string;

  /**
   * 名称
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



