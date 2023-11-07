/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

import type { Bundle } from './Bundle';

export interface AdminBundlesRes {
  /**
   * Bundle details.
   */
  bundle: SetRelation<Bundle, 'products'>;
};


