import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoForm, InfoQuery, InfoMiniVO, InfoOptionVO } from '@/api/goods/info/types';


/**
 * 查询商品信息列表
 * @param query
 * @returns {*}
 */
export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/goods/info/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商品信息详细
 * @param id
 */
export const getInfo = (id: string | number): AxiosPromise<InfoVO> => {
  return request({
    url: '/goods/info/' + id,
    method: 'get'
  });
};

/**
 * 新增商品信息
 * @param data
 */
export const addInfo = (data: InfoForm) => {
  return request({
    url: '/goods/info',
    method: 'post',
    data: data
  });
};

/**
 * 修改商品信息
 * @param data
 */
export const updateInfo = (data: InfoForm) => {
  return request({
    url: '/goods/info',
    method: 'put',
    data: data
  });
};

/**
 * 删除商品信息
 * @param id
 */
export const delInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/goods/info/' + id,
    method: 'delete'
  });
};

/**
 * 查询商品信息Mini列表
 * @param query
 * @returns {*}
 */
export const listInfoMini = (query?: InfoQuery): AxiosPromise<InfoMiniVO[]> => {
  return request({
    url: '/goods/info/list/mini',
    method: 'get',
    params: query
  });
};

/**
 * 查询商品信息Option列表
 * @param query
 * @returns {*}
 */
export const listInfoOption = (query?: InfoQuery): AxiosPromise<InfoOptionVO[]> => {
  return request({
    url: '/goods/info/list/option',
    method: 'get',
    params: query
  });
};