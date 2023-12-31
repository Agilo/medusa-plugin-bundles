/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { PricedVariant } from './PricedVariant';
import type { Product } from './Product';

export type PricedProduct = (Product & {
  /**
   * The product variants and their prices.
   */
  variants?: Array<PricedVariant>;
});

