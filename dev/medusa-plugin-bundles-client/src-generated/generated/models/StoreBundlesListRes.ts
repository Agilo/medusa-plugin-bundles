/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { Bundle } from './Bundle';

export interface StoreBundlesListRes {
  /**
   * An array of bundles details.
   */
  bundles: Array<SetRelation<Bundle, 'products'>>;
  /**
   * The total number of items available
   */
  count: number;
  /**
   * The number of products skipped when retrieving the products.
   */
  offset: number;
  /**
   * The number of items per page
   */
  limit: number;
};


