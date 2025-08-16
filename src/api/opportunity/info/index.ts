import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoForm, InfoQuery, InfoOptionVO } from '@/api/opportunity/info/types';

/**
 * 查询商机信息列表
 * @param query
 * @returns {*}
 */
export const listInfoOption = (query?: InfoQuery): AxiosPromise<InfoOptionVO[]> => {
  return request({
    url: '/opportunity/info/list/option',
    method: 'get',
    params: query
  });
};

/**
 * 查询商机信息列表
 * @param query
 * @returns {*}
 */
export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/opportunity/info/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商机信息详细
 * @param id
 */
export const getInfo = (id: string | number): AxiosPromise<InfoVO> => {
  return request({
    url: '/opportunity/info/' + id,
    method: 'get'
  });
};

/**
 * 新增商机信息
 * @param data
 */
export const addInfo = (data: InfoForm) => {
  return request({
    url: '/opportunity/info',
    method: 'post',
    data: data
  });
};

/**
 * 修改商机信息
 * @param data
 */
export const updateInfo = (data: InfoForm) => {
  return request({
    url: '/opportunity/info',
    method: 'put',
    data: data
  });
};

/**
 * 删除商机信息
 * @param id
 */
export const delInfo = (id: string | number | Array<string | number>) => {
  return request({
    url: '/opportunity/info/' + id,
    method: 'delete'
  });
};
