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

/**
 * 回收客户到公海
 * @param customerId
 * @returns
 */
export const reclaim = (customerId: string | number) => {
  return request({
    url: `/customer/info/my/reclaim/${customerId}`,
    method: 'put'
  });
};

/**
 * 转移客户到指定用户
 * @param customerId
 * @param userId
 * @returns
 */
export const transfer = (customerId: string | number, userId: string | number) => {
  return request({
    url: `/customer/info/my/transfer/${customerId}/${userId}`,
    method: 'put'
  });
};
