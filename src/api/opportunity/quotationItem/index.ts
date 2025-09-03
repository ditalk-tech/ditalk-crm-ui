import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { QuotationItemVO, QuotationItemForm, QuotationItemQuery } from '@/api/opportunity/quotationItem/types';

/**
 * 查询商机报价单明细列表
 * @param query
 * @returns {*}
 */

export const listQuotationItem = (query?: QuotationItemQuery): AxiosPromise<QuotationItemVO[]> => {
  return request({
    url: '/opportunity/quotationItem/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商机报价单明细详细
 * @param id
 */
export const getQuotationItem = (id: string | number): AxiosPromise<QuotationItemVO> => {
  return request({
    url: '/opportunity/quotationItem/' + id,
    method: 'get'
  });
};

/**
 * 新增商机报价单明细
 * @param data
 */
export const addQuotationItem = (data: QuotationItemForm) => {
  return request({
    url: '/opportunity/quotationItem',
    method: 'post',
    data: data
  });
};

/**
 * 修改商机报价单明细
 * @param data
 */
export const updateQuotationItem = (data: QuotationItemForm) => {
  return request({
    url: '/opportunity/quotationItem',
    method: 'put',
    data: data
  });
};

/**
 * 删除商机报价单明细
 * @param id
 */
export const delQuotationItem = (id: string | number | Array<string | number>) => {
  return request({
    url: '/opportunity/quotationItem/' + id,
    method: 'delete'
  });
};
