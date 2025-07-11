import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SkuSpecVO, SkuSpecForm, SkuSpecQuery } from '@/api/goods/skuSpec/types';

/**
 * 查询SKU规格列表
 * @param query
 * @returns {*}
 */

export const listSkuSpec = (query?: SkuSpecQuery): AxiosPromise<SkuSpecVO[]> => {
  return request({
    url: '/goods/skuSpec/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询SKU规格详细
 * @param id
 */
export const getSkuSpec = (id: string | number): AxiosPromise<SkuSpecVO> => {
  return request({
    url: '/goods/skuSpec/' + id,
    method: 'get'
  });
};

/**
 * 新增SKU规格
 * @param data
 */
export const addSkuSpec = (data: SkuSpecForm) => {
  return request({
    url: '/goods/skuSpec',
    method: 'post',
    data: data
  });
};

/**
 * 修改SKU规格
 * @param data
 */
export const updateSkuSpec = (data: SkuSpecForm) => {
  return request({
    url: '/goods/skuSpec',
    method: 'put',
    data: data
  });
};

/**
 * 删除SKU规格
 * @param id
 */
export const delSkuSpec = (id: string | number | Array<string | number>) => {
  return request({
    url: '/goods/skuSpec/' + id,
    method: 'delete'
  });
};
