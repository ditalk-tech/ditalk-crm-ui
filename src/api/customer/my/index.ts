import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoQuery, CustomerContactForm } from '@/api/customer/info/types';

export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/customer/info/my/list',
    method: 'get',
    params: query
  });
};

export const getInfo = (id: string | number): AxiosPromise<InfoVO> => {
  return request({
    url: `/customer/info/my/${id}`,
    method: 'get'
  });
};

/**
 * 更新客户及联系人信息
 * @param data
 * @returns
 */
export const updateCustomerContact = (data: CustomerContactForm) => {
  return request({
    url: '/customer/info/my',
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
    url: '/customer/info/my',
    method: 'post',
    data: data
  });
};
