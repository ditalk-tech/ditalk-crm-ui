import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { QuotationVO, QuotationForm, QuotationQuery } from '@/api/opportunity/quotation/types';

/**
 * 查询商机报价单列表
 * @param query
 * @returns {*}
 */

export const listQuotation = (query?: QuotationQuery): AxiosPromise<QuotationVO[]> => {
  return request({
    url: '/opportunity/quotation/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商机报价单详细
 * @param id
 */
export const getQuotation = (id: string | number): AxiosPromise<QuotationVO> => {
  return request({
    url: '/opportunity/quotation/' + id,
    method: 'get'
  });
};

/**
 * 新增商机报价单
 * @param data
 */
export const addQuotation = (data: QuotationForm) => {
  return request({
    url: '/opportunity/quotation',
    method: 'post',
    data: data
  });
};

/**
 * 修改商机报价单
 * @param data
 */
export const updateQuotation = (data: QuotationForm) => {
  return request({
    url: '/opportunity/quotation',
    method: 'put',
    data: data
  });
};

/**
 * 删除商机报价单
 * @param id
 */
export const delQuotation = (id: string | number | Array<string | number>) => {
  return request({
    url: '/opportunity/quotation/' + id,
    method: 'delete'
  });
};
