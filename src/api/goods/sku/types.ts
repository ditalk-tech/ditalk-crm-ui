export interface SkuVO {
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
   * 商品ID
   */
  goodsId: string | number;

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
   * 可用库存
   */
  availableStock: number;

  /**
   * 锁定库存
   */
  reservedStock: number;

  /**
   * 已占库存
   */
  allocatedStock: number;

  /**
   * 不可用库存
   */
  unavailableStock: number;

  /**
   * 总库存
   */
  totalStock: number;

  /**
   * 总销量
   */
  totalSales: number;

  /**
   * 状态
   */
  state: string;

}

export interface SkuForm extends BaseEntity {
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
   * 商品ID
   */
  goodsId?: string | number;

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
   * 可用库存
   */
  availableStock?: number;

  /**
   * 锁定库存
   */
  reservedStock?: number;

  /**
   * 已占库存
   */
  allocatedStock?: number;

  /**
   * 不可用库存
   */
  unavailableStock?: number;

  /**
   * 总库存
   */
  totalStock?: number;

  /**
   * 总销量
   */
  totalSales?: number;

  /**
   * 状态
   */
  state?: string;

}

export interface SkuQuery extends PageQuery {

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
   * 商品ID
   */
  goodsId?: string | number;

  /**
   * SKU编码
   */
  skuSn?: string;

  /**
   * 状态
   */
  state?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



