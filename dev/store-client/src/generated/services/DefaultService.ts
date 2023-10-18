/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreBundlesListRes,
} from '../models';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetBundles
   * List Bundles
   * Retrieves a list of bundles. The bundles can be filtered by `q` field. The bundles can also be paginated.
   *
   * @returns StoreBundlesListRes OK
   * @throws ApiError
   */
  public getBundles(
    queryParams: {
      /**
       * term used to search bundles' title and description.
       */
      q?: string,
      /**
       * The number of bundles to skip when retrieving the bundles.
       */
      offset?: number,
      /**
       * Limit the number of bundles returned.
       */
      limit?: number,
    },
    customHeaders: Record<string, any> = {}
  ): CancelablePromise<StoreBundlesListRes> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/store/bundles',
      headers: customHeaders,
      query: queryParams,
    });
  }

}
