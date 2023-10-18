/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import {
  StoreBundlesRes,
} from '../models';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProductsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * GetBundlesBundle
   * Get a Bundle
   * Retrieve a Bundle's details.
   *
   * @returns StoreBundlesRes OK
   * @throws ApiError
   */
  public getBundlesBundle(
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
