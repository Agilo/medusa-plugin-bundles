/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  AdminBundlesDeleteRes,
  AdminBundlesListRes,
  AdminBundlesRes,
  AdminGetBundlesParams,
  AdminPostBundlesBundleReq,
  AdminPostBundlesReq,
} from '../models';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class BundlesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * AdminGetBundles
   * List Bundles
   * Retrieve a list of bundles.
   * @returns AdminBundlesListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: AdminGetBundlesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminBundlesListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/bundles',
      headers: customHeaders,
      query: queryParams,
    });
  }

  /**
   * AdminPostBundles
   * Create a Bundle
   * Create a new Bundle. This endpoint can also be used to create a gift card if the `is_giftcard` field is set to `true`.
   * @returns AdminBundlesRes OK
   * @throws ApiError
   */
  public create(
    requestBody: AdminPostBundlesReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminBundlesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/bundles',
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * AdminGetBundlesBundle
   * Get a Bundle
   * Retrieve a Bundle's details.
   * @returns AdminBundlesRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminBundlesRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/admin/bundles/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
    });
  }

  /**
   * AdminPostBundlesBundle
   * Update a Bundle
   * Update a Bundle's details.
   * @returns AdminBundlesRes OK
   * @throws ApiError
   */
  public update(
    id: string,
    requestBody: AdminPostBundlesBundleReq,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminBundlesRes> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/admin/bundles/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
      body: requestBody,
      mediaType: 'application/json',
    });
  }

  /**
   * AdminDeleteBundlesBundle
   * Delete a Bundle
   * Delete a Bundle.
   * @returns AdminBundlesDeleteRes OK
   * @throws ApiError
   */
  public delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<AdminBundlesDeleteRes> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/admin/bundles/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
    });
  }

}
