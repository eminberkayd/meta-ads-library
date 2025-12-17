/**
 * Meta Ads Library SDK
 * A modern TypeScript SDK for the Facebook/Meta Ads Library API
 *
 * @packageDocumentation
 */

import { AdsLibraryClient, ChainableQuery } from './client.js';
import type { AdsLibraryConfig } from './types.js';

export { AdsLibraryClient, ChainableQuery };
export { QueryBuilder } from './query-builder.js';
export { EU_COUNTRIES } from './types.js';
export {
  AdsLibraryError,
  ApiRequestError,
  NetworkError,
  ValidationError,
} from './errors.js';

export type {
  // Configuration
  AdsLibraryConfig,

  // Query Parameters
  AdsLibraryQueryParams,
  AdActiveStatus,
  AdType,
  MediaType,
  PublisherPlatform,
  SearchType,
  AdField,
  AdReachedCountry,

  // Response Types
  AdsLibraryResponse,
  Ad,
  Paging,
  PagingCursors,
  InsightsRangeValue,
  AudienceDistribution,
  AgeCountryGenderReachBreakdown,
  BeneficiaryPayer,
  TargetLocation,

  // Error Types
  ApiError,
  ApiErrorResponse,

  // SDK Types
  IterateOptions,
} from './types.js';

/**
 * Create a new Ads Library client.
 * Convenience function for creating a client instance.
 *
 * @param accessToken - Facebook Graph API access token
 * @param options - Optional configuration options
 * @returns Configured AdsLibraryClient instance
 *
 * @example
 * ```ts
 * import { createClient } from 'meta-ads-library';
 *
 * const client = createClient('your-access-token');
 *
 * const ads = await client
 *   .query()
 *   .inCountries(['US'])
 *   .withSearchTerms('coffee')
 *   .execute();
 * ```
 */
export function createClient(
  accessToken: string,
  options: Omit<AdsLibraryConfig, 'accessToken'> = {}
): AdsLibraryClient {
  return new AdsLibraryClient({ accessToken, ...options });
}

// Default export for convenience
export default AdsLibraryClient;
