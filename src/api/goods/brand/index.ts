import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BrandVO, BrandForm, BrandQuery } from '@/api/goods/brand/types';

/**
 * 查询商品品牌信息列表
 * @param query
 * @returns {*}
 */

export const listBrand = (query?: BrandQuery): AxiosPromise<BrandVO[]> => {
  return request({
    url: '/goods/brand/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商品品牌信息详细
 * @param id
 */
export const getBrand = (id: string | number): AxiosPromise<BrandVO> => {
  return request({
    url: '/goods/brand/' + id,
    method: 'get'
  });
};

/**
 * 新增商品品牌信息
 * @param data
 */
export const addBrand = (data: BrandForm) => {
  return request({
    url: '/goods/brand',
    method: 'post',
    data: data
  });
};

/**
 * 修改商品品牌信息
 * @param data
 */
export const updateBrand = (data: BrandForm) => {
  return request({
    url: '/goods/brand',
    method: 'put',
    data: data
  });
};

/**
 * 删除商品品牌信息
 * @param id
 */
export const delBrand = (id: string | number | Array<string | number>) => {
  return request({
    url: '/goods/brand/' + id,
    method: 'delete'
  });
};
