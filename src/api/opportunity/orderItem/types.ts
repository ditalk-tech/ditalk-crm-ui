export interface OrderItemVO {
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
   * 店铺ID
   */
  shopId: string | number;

  /**
   * 客户ID
   */
  customerId: string | number;

  /**
   * 商品快照ID
   */
  goodsSnapshotId: string | number;

  /**
   * 商品快照ID
   */
  skuId: string | number;

  /**
   * SKU编码
   */
  skuSn: string;

  /**
   * 图片
   */
  mainPic: number;

  /**
   * 图片Url
   */
  mainPicUrl: string;
  /**
   * 规格JSON
   */
  specJson: string;

  /**
   * 售价
   */
  salePrice: number;

  /**
   * 原价
   */
  originalPrice: number;

  /**
   * 成本价
   */
  costPrice: number;

  /**
   * 重量(kg)
   */
  weight: number;

  /**
   * 体积(m³)
   */
  volume: number;

  /**
   * 单价
   */
  unitPrice: number;

  /**
   * 购买数量
   */
  quantity: number;

  /**
   * 总价
   */
  totalPrice: number;
}

export interface OrderItemForm extends BaseEntity {
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
   * 店铺ID
   */
  shopId?: string | number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 商品快照ID
   */
  goodsSnapshotId?: string | number;

  /**
   * 商品快照ID
   */
  skuId?: string | number;

  /**
   * SKU编码
   */
  skuSn?: string;

  /**
   * 图片
   */
  mainPic?: number;

  /**
   * 规格JSON
   */
  specJson?: string;

  /**
   * 售价
   */
  salePrice?: number;

  /**
   * 原价
   */
  originalPrice?: number;

  /**
   * 成本价
   */
  costPrice?: number;

  /**
   * 重量(kg)
   */
  weight?: number;

  /**
   * 体积(m³)
   */
  volume?: number;

  /**
   * 单价
   */
  unitPrice?: number;

  /**
   * 购买数量
   */
  quantity?: number;

  /**
   * 总价
   */
  totalPrice?: number;
}

export interface OrderItemQuery extends PageQuery {
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
   * 店铺ID
   */
  shopId?: string | number;

  /**
   * 客户ID
   */
  customerId?: string | number;

  /**
   * 商品快照ID
   */
  goodsSnapshotId?: string | number;

  /**
   * 商品快照ID
   */
  skuId?: string | number;

  /**
   * SKU编码
   */
  skuSn?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
