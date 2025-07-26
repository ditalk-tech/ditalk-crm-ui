import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ActivityVO, ActivityForm, ActivityQuery } from '@/api/customer/activity/types';

/**
 * 查询客户活动记录列表
 * @param query
 * @returns {*}
 */

export const listActivity = (query?: ActivityQuery): AxiosPromise<ActivityVO[]> => {
  return request({
    url: '/customer/activity/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户活动记录详细
 * @param id
 */
export const getActivity = (id: string | number): AxiosPromise<ActivityVO> => {
  return request({
    url: '/customer/activity/' + id,
    method: 'get'
  });
};

/**
 * 新增客户活动记录
 * @param data
 */
export const addActivity = (data: ActivityForm) => {
  return request({
    url: '/customer/activity',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户活动记录
 * @param data
 */
export const updateActivity = (data: ActivityForm) => {
  return request({
    url: '/customer/activity',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户活动记录
 * @param id
 */
export const delActivity = (id: string | number | Array<string | number>) => {
  return request({
    url: '/customer/activity/' + id,
    method: 'delete'
  });
};
