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
   * 店铺ID
   */
  shopId: string | number;

  /**
   * 分类ID
   */
  categoryId: string | number;

  /**
   * 编码
   */
  spuCode: string;

  /**
   * 名称
   */
  name: string;

  /**
   * 副标题
   */
  subtitle: string;

  /**
   * 主图ID
   */
  mainPic: number;

  /**
   * 主图IDUrl
   */
  mainPicUrl: string;
  /**
   * 轮播图ID组
   */
  subPics: string;

  /**
   * 轮播图ID组Url
   */
  subPicsUrl: string;
  /**
   * 条形码
   */
  barCode: string;

  /**
   * 品牌ID
   */
  brandId: string | number;

  /**
   * 商品说明
   */
  content: string;

  /**
   * 最低价
   */
  minPrice: number;

  /**
   * 总销量
   */
  totalSales: number;

  /**
   * 可用库存
   */
  availableStock: number;

  /**
   * 综合评分
   */
  overallScore: number;

  /**
   * 排序
   */
  sortOrder: number;

  /**
   * 属性JSON
   */
  attrJson: string;

  /**
   * 规格JSON
   */
  specJson: string;

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
   * 店铺ID
   */
  shopId?: string | number;

  /**
   * 分类ID
   */
  categoryId?: string | number;

  /**
   * 编码
   */
  spuCode?: string;

  /**
   * 名称
   */
  name?: string;

  /**
   * 副标题
   */
  subtitle?: string;

  /**
   * 主图ID
   */
  mainPic?: number;

  /**
   * 轮播图ID组
   */
  subPics?: string;

  /**
   * 条形码
   */
  barCode?: string;

  /**
   * 品牌ID
   */
  brandId?: string | number;

  /**
   * 商品说明
   */
  content?: string;

  /**
   * 最低价
   */
  minPrice?: number;

  /**
   * 总销量
   */
  totalSales?: number;

  /**
   * 可用库存
   */
  availableStock?: number;

  /**
   * 综合评分
   */
  overallScore?: number;

  /**
   * 排序
   */
  sortOrder?: number;

  /**
   * 属性JSON
   */
  attrJson?: string;

  /**
   * 规格JSON
   */
  specJson?: string;

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
   * 店铺ID
   */
  shopId?: string | number;

  /**
   * 分类ID
   */
  categoryId?: string | number;

  /**
   * 编码
   */
  spuCode?: string;

  /**
   * 名称
   */
  name?: string;

  /**
   * 条形码
   */
  barCode?: string;

  /**
   * 品牌ID
   */
  brandId?: string | number;

  /**
   * 状态
   */
  state?: string;

  /**
   * 日期范围参数
   */
  params?: any;

}

export interface InfoMiniVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 名称
   */
  name: string;

  /**
   * 副标题
   */
  subtitle: string;

  /**
   * 主图ID
   */
  mainPic: number;

  /**
   * 主图IDUrl
   */
  mainPicUrl: string;

  /**
   * 最低价
   */
  minPrice: number;

  /**
   * 总销量
   */
  totalSales: number;

  /**
   * 可用库存
   */
  availableStock: number;

  /**
   * 综合评分
   */
  overallScore: number;

}

export interface InfoOptionVO {
  /**
   * ID
   */
  id: string | number;

  /**
   * 名称
   */
  name: string;

}

export interface InfoContentForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 乐观锁
   */
  version?: number;

  /**
   * 商品说明
   */
  content?: string;
}