import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoForm, InfoQuery } from '@/api/customer/info/types';

/**
 * 查询客户信息列表
 * @param query
 * @returns {*}
 */
export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/customer/info/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户信息详细
 * @param id
 */
export const getInfo = (id: string | number): AxiosPromise<InfoVO> => {
  return request({
    url: '/customer/info/' + id,
    method: 'get'
  });
};

/**
 * 新增客户信息
 * @param data
 */
export const addInfo = (data: InfoForm) => {
  return request({
    url: '/customer/info',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户信息
 * @param data
 */
export const updateInfo = (data: InfoForm) => {
  return request({
    url: '/customer/info',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户信息
 * @param id
 */
export const delInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/customer/info/' + id,
    method: 'delete'
  });
};

// /**
//  * 全量查询客户信息选择列表 —— 主要用于select组件
//  * @returns {*}
//  */
// export const listInfoOption = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
//   return request({
//     url: '/customer/info/list/option',
//     method: 'get',
//     params: query
//   });
// };

// /**
//  * 分页查询客户信息选择列表 —— 主要用于select组件
//  * @returns {*}
//  */
// export const listPageInfoOption = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
//   return request({
//     url: '/customer/info/list/page/option',
//     method: 'get',
//     params: query
//   });
// };
