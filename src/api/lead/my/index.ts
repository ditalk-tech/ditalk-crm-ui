import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoForm, InfoQuery, LeadContactForm } from '@/api/lead/info/types';

/**
 * 查询线索信息列表
 * @param query
 * @returns {*}
 */

export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/lead/info/my/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询线索信息详细
 * @param id
 */
export const getInfo = (id: string | number): AxiosPromise<InfoVO> => {
  return request({
    url: '/lead/info/my/' + id,
    method: 'get'
  });
};

/**
 * 新增线索信息
 * @param data
 */
export const addInfo = (data: InfoForm) => {
  return request({
    url: '/lead/info/my',
    method: 'post',
    data: data
  });
};

/**
 * 修改线索信息
 * @param data
 */
export const updateInfo = (data: InfoForm) => {
  return request({
    url: '/lead/info/my',
    method: 'put',
    data: data
  });
};

/**
 * 删除线索信息
 * @param id
 */
export const delInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lead/info/my/' + id,
    method: 'delete'
  });
};

/**
 * 更新客户线索及联系人信息
 * @param data
 * @returns
 */
export const updateLeadContact = (data: LeadContactForm) => {
  return request({
    url: '/lead/info/my',
    method: 'put',
    data: data
  });
};

/**
 * 新增客户线索及联系人信息
 * @param data
 * @returns
 */
export const addLeadContact = (data: LeadContactForm) => {
  return request({
    url: '/lead/info/my',
    method: 'post',
    data: data
  });
};

/**
 * 单个或批量回收线索到线索池
 * @param leadIds
 * @returns
 */
export const reclaim = (leadIds: string | number | Array<string | number>) => {
  return request({
    url: `/lead/info/my/reclaim/${leadIds}`,
    method: 'put'
  });
};

/**
 * 单个或批量转移线索到指定用户
 * @param leadIds
 * @param userId
 * @returns
 */
export const transfer = (leadIds: string | number | Array<string | number>, userId: string | number) => {
  return request({
    url: `/lead/info/my/transfer/${leadIds}/${userId}`,
    method: 'put'
  });
};
