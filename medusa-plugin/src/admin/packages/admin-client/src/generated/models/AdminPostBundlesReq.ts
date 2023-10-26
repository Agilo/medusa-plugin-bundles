/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

export interface AdminPostBundlesReq {
  /**
   * The title of the Bundle
   */
  title: string;
  /**
   * An optional handle to be used in slugs. If none is provided, the kebab-case version of the title will be used.
   */
  handle?: string;
  /**
   * The description of the Bundle.
   */
  description?: string;
};


