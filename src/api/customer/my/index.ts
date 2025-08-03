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
 * 单个或批量回收客户到公海
 * @param customerIds
 * @returns
 */
export const reclaim = (customerIds: string | number | Array<string | number>) => {
  return request({
    url: `/customer/info/my/reclaim/${customerIds}`,
    method: 'put'
  });
};

/**
 * 单个或批量转移客户到指定用户
 * @param customerIds
 * @param userId
 * @returns
 */
export const transfer = (customerIds: string | number | Array<string | number>, userId: string | number) => {
  return request({
    url: `/customer/info/my/transfer/${customerIds}/${userId}`,
    method: 'put'
  });
};

/**
 * 转移指定用户的客户到另一个用户
 * @param sourceUserId 原用户
 * @param targetUserId 目标用户
 * @returns
 */
export const transferUserCustomer = (sourceUserId: string | number, targetUserId: string | number) => {
  return request({
    url: `/customer/info/my/transfer/user/${sourceUserId}/${targetUserId}`,
    method: 'put'
  });
};

/**
 * 回收指定用户的客户到客户公海
 * @param userId 用户id
 * @returns
 */
export const reclaimUserCustomer = (userId: string | number) => {
  return request({
    url: `/customer/info/my/reclaim/user/${userId}`,
    method: 'put'
  });
};
