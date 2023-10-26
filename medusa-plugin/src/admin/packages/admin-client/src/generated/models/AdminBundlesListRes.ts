/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { Bundle } from './Bundle';

export interface AdminBundlesListRes {
  /**
   * An array of bundles details.
   */
  bundles: Array<SetRelation<Bundle, 'products'>>;
  /**
   * The total number of items available
   */
  count: number;
  /**
   * The number of bundles skipped when retrieving the bundles.
   */
  offset: number;
  /**
   * The number of items per page
   */
  limit: number;
};


