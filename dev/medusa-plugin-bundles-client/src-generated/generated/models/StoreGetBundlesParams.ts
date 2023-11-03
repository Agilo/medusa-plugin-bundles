/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

export interface StoreGetBundlesParams {
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
  /**
   * Filter by product ID. When provided, only bundles that contain the specified product are retrieved.
   */
  product_id?: string;
  /**
   * Filter by handle.
   */
  handle?: string;
};


