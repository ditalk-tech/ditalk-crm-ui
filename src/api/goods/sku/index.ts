import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SkuVO, SkuForm, SkuQuery } from '@/api/goods/sku/types';

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
