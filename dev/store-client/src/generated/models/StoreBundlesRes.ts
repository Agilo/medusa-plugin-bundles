/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { Bundle } from './Bundle';

export interface StoreBundlesRes {
  /**
   * Bundle details.
   */
  bundle: SetRelation<Bundle, 'products'>;
};


