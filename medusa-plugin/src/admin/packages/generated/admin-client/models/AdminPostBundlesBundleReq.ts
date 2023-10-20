/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { SetRelation, Merge } from '../core/ModelUtils';

export interface AdminPostBundlesBundleReq {
  /**
   * The title of the Bundle
   */
  title?: string;
  /**
   * The description of the Bundle.
   */
  description?: string;
  /**
   * The status of the bundle. The bundle is shown to the customer only if its status is `published`.
   */
  status?: 'draft' | 'published';
  /**
   * The thumbnail to use for the Bundle. The value is a URL to the thumbnail. You can use the upload endpoints to upload the thumbnail and obtain a URL.
   */
  thumbnail?: string;
};


