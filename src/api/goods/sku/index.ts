import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SkuVO, SkuForm, SkuQuery, SkuBatchForm } from '@/api/goods/sku/types';

export const initSkuVO = (): SkuVO => {
  return {
    id: '',
    createTime: '',
    version: 0,
    shopId: '',
    goodsId: '',
    skuSn: '',
    mainPic: 0,
    mainPicUrl: '',
    specJson: '',
    salePrice: 0,
    originalPrice: 0,
    costPrice: 0,
    weight: 0,
    volume: 0,
    availableStock: 0,
    reservedStock: 0,
    allocatedStock: 0,
    unavailableStock: 0,
    totalStock: 0,
    totalSales: 0,
    state: ''
  };
};

export const skuVO2Form = (skuVO: SkuVO): SkuForm => {
  const skuForm = {
    id: skuVO.id,
    version: skuVO.version,
    // shopId: skuVO.shopId,
    // goodsId: skuVO.goodsId,
    skuSn: skuVO.skuSn,
    mainPic: skuVO.mainPic,
    // mainPicUrl: skuVO.mainPicUrl,
    specJson: skuVO.specJson,
    salePrice: skuVO.salePrice,
    originalPrice: skuVO.originalPrice,
    costPrice: skuVO.costPrice,
    weight: skuVO.weight,
    volume: skuVO.volume,
    availableStock: skuVO.availableStock,
    // reservedStock: skuVO.reservedStock,
    // allocatedStock: skuVO.allocatedStock,
    // unavailableStock: skuVO.unavailableStock,
    // totalStock: skuVO.totalStock,
    // totalSales: skuVO.totalSales,
    // state: skuVO.state
  };
  return skuForm;
}

/**
 * 查询商品SKU列表
 * @param query
 * @returns {*}
 */
export const listSku = (query?: SkuQuery): AxiosPromise<SkuVO[]> => {
  return request({
    url: '/goods/sku/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商品SKU详细
 * @param id
 */
export const getSku = (id: string | number): AxiosPromise<SkuVO> => {
  return request({
    url: '/goods/sku/' + id,
    method: 'get'
  });
};

/**
 * 新增商品SKU
 * @param data
 */
export const addSku = (data: SkuForm) => {
  return request({
    url: '/goods/sku',
    method: 'post',
    data: data
  });
};

/**
 * 修改商品SKU
 * @param data
 */
export const updateSku = (data: SkuForm) => {
  return request({
    url: '/goods/sku',
    method: 'put',
    data: data
  });
};

/**
 * 删除商品SKU
 * @param id
 */
export const delSku = (id: string | number | Array<string | number>) => {
  return request({
    url: '/goods/sku/' + id,
    method: 'delete'
  });
};

/**
 * 批量更新商品SKU
 * @param data
 */
export const batchUpdateSku = (data: SkuBatchForm) => {
  return request({
    url: '/goods/sku/batch',
    method: 'put',
    data: data
  });
};