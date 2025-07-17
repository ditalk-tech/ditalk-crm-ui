import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoForm, InfoQuery } from '@/api/lead/info/types';

/**
 * 查询线索信息列表
 * @param query
 * @returns {*}
 */

export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/lead/info/list',
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
    url: '/lead/info/' + id,
    method: 'get'
  });
};

/**
 * 新增线索信息
 * @param data
 */
export const addInfo = (data: InfoForm) => {
  return request({
    url: '/lead/info',
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
    url: '/lead/info',
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
    url: '/lead/info/' + id,
    method: 'delete'
  });
};
