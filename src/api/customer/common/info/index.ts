/**
 * 不区分客户和线索，把客户和线索统一为 Customer
 */
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoVO } from '@/api/customer/info/types';

/**
 * 查询客户信息详细
 * @param id
 */
export const getInfo = (id: string | number): AxiosPromise<InfoVO> => {
  return request({
    url: '/customer/common/info/' + id,
    method: 'get'
  });
};
