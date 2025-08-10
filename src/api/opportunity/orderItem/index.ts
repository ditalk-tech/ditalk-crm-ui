import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { OrderItemVO, OrderItemForm, OrderItemQuery } from '@/api/opportunity/orderItem/types';

/**
 * 查询商机商品列表
 * @param query
 * @returns {*}
 */

export const listOrderItem = (query?: OrderItemQuery): AxiosPromise<OrderItemVO[]> => {
  return request({
    url: '/opportunity/orderItem/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商机商品详细
 * @param id
 */
export const getOrderItem = (id: string | number): AxiosPromise<OrderItemVO> => {
  return request({
    url: '/opportunity/orderItem/' + id,
    method: 'get'
  });
};

/**
 * 新增商机商品
 * @param data
 */
export const addOrderItem = (data: OrderItemForm) => {
  return request({
    url: '/opportunity/orderItem',
    method: 'post',
    data: data
  });
};

/**
 * 修改商机商品
 * @param data
 */
export const updateOrderItem = (data: OrderItemForm) => {
  return request({
    url: '/opportunity/orderItem',
    method: 'put',
    data: data
  });
};

/**
 * 删除商机商品
 * @param id
 */
export const delOrderItem = (id: string | number | Array<string | number>) => {
  return request({
    url: '/opportunity/orderItem/' + id,
    method: 'delete'
  });
};
