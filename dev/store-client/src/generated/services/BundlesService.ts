/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreBundlesListRes,
  StoreBundlesRes,
  StoreGetBundlesParams,
} from '../models';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class BundlesService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetBundles
   * List Bundles
   * Retrieves a list of bundles. The bundles can be filtered by `q` field. The bundles can also be paginated.
   *
   * @returns StoreBundlesListRes OK
   * @throws ApiError
   */
  public list(
    queryParams: StoreGetBundlesParams,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreBundlesListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/bundles',
      headers: customHeaders,
      query: queryParams,
    });
  }

  /**
   * GetBundlesBundle
   * Get a Bundle
   * Retrieve a Bundle's details.
   *
   * @returns StoreBundlesRes OK
   * @throws ApiError
   */
  public retrieve(
    id: string,
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreBundlesRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/bundles/{id}',
      path: {
        'id': id,
      },
      headers: customHeaders,
    });
  }

}
