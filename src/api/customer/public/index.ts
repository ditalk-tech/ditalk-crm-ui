import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO, InfoQuery } from '@/api/customer/info/types';

export const listInfo = (query?: InfoQuery): AxiosPromise<InfoVO[]> => {
  return request({
    url: '/customer/info/public/list',
    method: 'get',
    params: query
  });
};

export const getInfo = (id: string | number): AxiosPromise<InfoVO> => {
  return request({
    url: `/customer/info/public/${id}`,
    method: 'get'
  });
};

/**
 * 领取客户
 * @param userId 用户id
 * @param customerIds 客户id列表
 * @returns 领取结果
 */
export const claim = (userId: string | number, customerIds: string | number | Array<string | number>) => {
  return request({
    url: `/customer/info/public/claim/${userId}/${customerIds}`,
    method: 'put'
  });
};
