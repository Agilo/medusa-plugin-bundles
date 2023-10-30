/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import type { ProductOption } from '@medusajs/medusa';
import type { ProductVariant } from '@medusajs/medusa';

export interface StoreBundlesBundleProductsListRes {
  /**
   * An array of products details.
   */
  products: Array<Merge<SetRelation<PricedProduct, 'collection' | 'images' | 'options' | 'tags' | 'type' | 'variants'>, {
    options: Array<SetRelation<ProductOption, 'values'>>,
    variants: Array<SetRelation<ProductVariant, 'options' | 'prices' | 'purchasable'>>,
  }>>;
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


