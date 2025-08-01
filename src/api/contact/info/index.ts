import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoForm, InfoQuery, InfoOptionVO } from '@/api/contact/info/types';

/**
 * 查询联系人信息列表
 * @param query
 * @returns {*}
 */
export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/contact/info/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询联系人信息详细
 * @param id
 */
export const getInfo = (id: string | number): AxiosPromise<InfoVO> => {
  return request({
    url: '/contact/info/' + id,
    method: 'get'
  });
};

/**
 * 新增联系人信息
 * @param data
 */
export const addInfo = (data: InfoForm) => {
  return request({
    url: '/contact/info',
    method: 'post',
    data: data
  });
};

/**
 * 修改联系人信息
 * @param data
 */
export const updateInfo = (data: InfoForm) => {
  return request({
    url: '/contact/info',
    method: 'put',
    data: data
  });
};

/**
 * 删除联系人信息
 * @param id
 */
export const delInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/contact/info/' + id,
    method: 'delete'
  });
};

/**
 * 查询联系人信息选项列表（下拉选择）
 * @param customerId
 * @returns {*}
 */
export const listInfoOption = (customerId: string | number): AxiosPromise<InfoOptionVO[]> => {
  return request({
    url: '/contact/info/list/options/' + customerId,
    method: 'get'
  });
};
