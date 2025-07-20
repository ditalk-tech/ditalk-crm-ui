import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoForm, InfoQuery, CustomerContactForm } from '@/api/customer/info/types';

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

/**
 * 更新客户及联系人信息
 * @param data
 * @returns
 */
export const updateCustomerContact = (data: CustomerContactForm) => {
  return request({
    url: '/app/customer/info',
    method: 'put',
    data: data
  });
};

/**
 * 新增客户及联系人信息
 * @param data
 * @returns
 */
export const addCustomerContact = (data: CustomerContactForm) => {
  return request({
    url: '/app/customer/info',
    method: 'post',
    data: data
  });
};
