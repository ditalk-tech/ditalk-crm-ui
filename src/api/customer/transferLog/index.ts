import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TransferLogVO, TransferLogForm, TransferLogQuery } from '@/api/customer/transferLog/types';

/**
 * 查询客户转移记录列表
 * @param query
 * @returns {*}
 */

export const listTransferLog = (query?: TransferLogQuery): AxiosPromise<TransferLogVO[]> => {
  return request({
    url: '/customer/transferLog/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户转移记录详细
 * @param id
 */
export const getTransferLog = (id: string | number): AxiosPromise<TransferLogVO> => {
  return request({
    url: '/customer/transferLog/' + id,
    method: 'get'
  });
};

/**
 * 新增客户转移记录
 * @param data
 */
export const addTransferLog = (data: TransferLogForm) => {
  return request({
    url: '/customer/transferLog',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户转移记录
 * @param data
 */
export const updateTransferLog = (data: TransferLogForm) => {
  return request({
    url: '/customer/transferLog',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户转移记录
 * @param id
 */
export const delTransferLog = (id: string | number | Array<string | number>) => {
  return request({
    url: '/customer/transferLog/' + id,
    method: 'delete'
  });
};
