import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoQuery } from '@/api/lead/info/types';

/**
 * 查询线索信息列表
 * @param query
 * @returns {*}
 */

export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/lead/info/public/list',
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
    url: '/lead/info/public/' + id,
    method: 'get'
  });
};
