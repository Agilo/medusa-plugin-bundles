/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { Product } from './Product';

export interface StoreBundlesBundleProductsListRes {
  /**
   * An array of products details.
   */
  products: Array<Product>;
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


