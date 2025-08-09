export interface InfoSnapshotVO {
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
   * 商品ID
   */
  goodsId: string | number;

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
   * 综合评分（满10分）
   */
  overallScore: number;

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

export interface InfoSnapshotForm extends BaseEntity {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 乐观锁
   */
  version?: number;

  /**
   * 商品ID
   */
  goodsId?: string | number;

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
   * 综合评分（满10分）
   */
  overallScore?: number;

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

export interface InfoSnapshotQuery extends PageQuery {
  /**
   * ID
   */
  id?: string | number;

  /**
   * 创建时间
   */
  createTime?: string;

  /**
   * 商品ID
   */
  goodsId?: string | number;

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
