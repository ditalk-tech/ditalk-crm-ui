import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoForm, InfoQuery } from '@/api/contract/info/types';

/**
 * 查询合同信息列表
 * @param query
 * @returns {*}
 */

export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/contract/info/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询合同信息详细
 * @param id
 */
export const getInfo = (id: string | number): AxiosPromise<InfoVO> => {
  return request({
    url: '/contract/info/' + id,
    method: 'get'
  });
};

/**
 * 新增合同信息
 * @param data
 */
export const addInfo = (data: InfoForm) => {
  return request({
    url: '/contract/info',
    method: 'post',
    data: data
  });
};

/**
 * 修改合同信息
 * @param data
 */
export const updateInfo = (data: InfoForm) => {
  return request({
    url: '/contract/info',
    method: 'put',
    data: data
  });
};

/**
 * 删除合同信息
 * @param id
 */
export const delInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/contract/info/' + id,
    method: 'delete'
  });
};
