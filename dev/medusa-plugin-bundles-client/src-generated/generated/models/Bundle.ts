/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { Product } from './Product';

/**
 * A bundle is a group of products.
 */
export interface Bundle {
  /**
   * The bundle's ID
   */
  id: string;
  /**
   * A title that can be displayed for easy identification of the Bundle.
   */
  title: string;
  /**
   * A unique string that identifies the Product Bundle - can for example be used in slug structures.
   */
  handle: string;
  /**
   * A short description of the Bundle.
   */
  description: string | null;
  /**
   * The details of the products used in this bundle.
   */
  products: Array<Product>;
  /**
   * The status of the bundle
   */
  status: 'draft' | 'published';
  /**
   * A URL to an image file that can be used to identify the Bundle.
   */
  thumbnail: string | null;
  /**
   * The date with timezone at which the resource was created.
   */
  created_at: string;
  /**
   * The date with timezone at which the resource was updated.
   */
  updated_at: string;
};


