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
