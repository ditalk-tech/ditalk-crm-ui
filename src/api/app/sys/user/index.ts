import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { UserQuery } from '@/api/system/user/types';
import { UserOption } from './types';

/**
 * 查询当前用户值
 */
export const getMyInfo = (): AxiosPromise<UserOption> => {
  return request({
    url: '/app/sys/user/getMyInfo',
    method: 'get'
  })
};

/**
 * 查询用户列表
 * @param query
 */
export const listOption = (query: UserQuery): AxiosPromise<UserOption[]> => {
  return request({
    url: '/app/sys/user/listOption',
    method: 'get',
    params: query
  });
};
