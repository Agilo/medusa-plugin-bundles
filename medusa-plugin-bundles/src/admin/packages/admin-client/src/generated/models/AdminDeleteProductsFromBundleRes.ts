/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

export interface AdminDeleteProductsFromBundleRes {
  /**
   * The ID of the bundle
   */
  id: string;
  /**
   * The type of object the removal was executed on
   */
  object: string;
  /**
   * The IDs of the products removed from the bundle
   */
  removed_products: Array<string>;
};


