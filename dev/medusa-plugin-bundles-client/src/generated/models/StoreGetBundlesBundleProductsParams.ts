/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

export interface StoreGetBundlesBundleProductsParams {
  /**
   * term used to search bundles' title and description.
   */
  'q'?: string;
  /**
   * The number of bundles to skip when retrieving the bundles.
   */
  offset?: number;
  /**
   * Limit the number of bundles returned.
   */
  limit?: number;
};


