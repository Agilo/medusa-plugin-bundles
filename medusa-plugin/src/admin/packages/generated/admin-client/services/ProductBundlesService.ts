/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminBundlesRes,
  AdminDeleteProductsFromBundleReq,
  AdminDeleteProductsFromBundleRes,
  AdminPostProductsToBundleReq,
} from '../models';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductBundlesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * AdminPostProductsToBundle
   * Add Products to Bundle
   * Add products to a product bundle.
   * @returns AdminBundlesRes OK
   * @throws ApiError
   */
  public addProducts(
    id: string,
    requestBody: AdminPostProductsToBundleReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminBundlesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/bundles/{id}/products/batch',
      path: {
        'id': id,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * DeleteProductsFromBundle
   * Remove Products from Bundle
   * Remove a list of products from a bundle. This would not delete the product, only the association between the product and the bundle.
   * @returns AdminDeleteProductsFromBundleRes OK
   * @throws ApiError
   */
  public removeProducts(
    id: string,
    requestBody: AdminDeleteProductsFromBundleReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminDeleteProductsFromBundleRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/bundles/{id}/products/batch',
      path: {
        'id': id,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
    });
  }

}
