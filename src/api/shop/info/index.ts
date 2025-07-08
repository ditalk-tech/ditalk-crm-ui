import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoForm, InfoQuery } from '@/api/shop/info/types';

/**
 * 查询店铺信息列表
 * @param query
 * @returns {*}
 */

export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/shop/info/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询店铺信息详细
 * @param id
 */
export const getInfo = (id: string | number): AxiosPromise<InfoVO> => {
  return request({
    url: '/shop/info/' + id,
    method: 'get'
  });
};

/**
 * 新增店铺信息
 * @param data
 */
export const addInfo = (data: InfoForm) => {
  return request({
    url: '/shop/info',
    method: 'post',
    data: data
  });
};

/**
 * 修改店铺信息
 * @param data
 */
export const updateInfo = (data: InfoForm) => {
  return request({
    url: '/shop/info',
    method: 'put',
    data: data
  });
};

/**
 * 删除店铺信息
 * @param id
 */
export const delInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/shop/info/' + id,
    method: 'delete'
  });
};
