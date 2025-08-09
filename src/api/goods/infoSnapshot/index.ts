import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { InfoSnapshotVO, InfoSnapshotForm, InfoSnapshotQuery } from '@/api/goods/infoSnapshot/types';

/**
 * 查询商品信息快照列表
 * @param query
 * @returns {*}
 */

export const listInfoSnapshot = (query?: InfoSnapshotQuery): AxiosPromise<InfoSnapshotVO[]> => {
  return request({
    url: '/goods/infoSnapshot/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询商品信息快照详细
 * @param id
 */
export const getInfoSnapshot = (id: string | number): AxiosPromise<InfoSnapshotVO> => {
  return request({
    url: '/goods/infoSnapshot/' + id,
    method: 'get'
  });
};

/**
 * 新增商品信息快照
 * @param data
 */
export const addInfoSnapshot = (data: InfoSnapshotForm) => {
  return request({
    url: '/goods/infoSnapshot',
    method: 'post',
    data: data
  });
};

/**
 * 修改商品信息快照
 * @param data
 */
export const updateInfoSnapshot = (data: InfoSnapshotForm) => {
  return request({
    url: '/goods/infoSnapshot',
    method: 'put',
    data: data
  });
};

/**
 * 删除商品信息快照
 * @param id
 */
export const delInfoSnapshot = (id: string | number | Array<string | number>) => {
  return request({
    url: '/goods/infoSnapshot/' + id,
    method: 'delete'
  });
};
