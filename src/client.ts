import type {
  Ad,
  AdsLibraryConfig,
  AdsLibraryQueryParams,
  AdsLibraryResponse,
  ApiErrorResponse,
  IterateOptions,
} from './types.js';
import { QueryBuilder } from './query-builder.js';
import { ApiRequestError, NetworkError, ValidationError } from './errors.js';

const DEFAULT_API_VERSION = 'v24.0';
const DEFAULT_BASE_URL = 'https://graph.facebook.com';
const DEFAULT_TIMEOUT = 30000;

/**
 * Facebook/Meta Ads Library API Client.
 * Provides a fluent interface for querying the Ads Library API.
 *
 * @example
 * ```ts
 * const client = new AdsLibraryClient({
 *   accessToken: 'your-access-token',
 * });
 *
 * // Using query builder
 * const ads = await client
 *   .query()
 *   .inCountries(['US'])
 *   .withSearchTerms('coffee')
 *   .activeOnly()
 *   .withFields(['id', 'page_name', 'ad_creative_bodies'])
 *   .execute();
 *
 * // Using raw parameters
 * const response = await client.search({
 *   ad_reached_countries: ['US'],
 *   search_terms: 'coffee',
 * });
 * ```
 */
export class AdsLibraryClient {
  private readonly accessToken: string;
  private readonly apiVersion: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(config: AdsLibraryConfig) {
    if (!config.accessToken) {
      throw new ValidationError('accessToken is required');
    }

    this.accessToken = config.accessToken;
    this.apiVersion = config.apiVersion ?? DEFAULT_API_VERSION;
    this.baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
  }

  /**
   * Create a new query builder for fluent API usage.
   * @returns A chainable QueryBuilder instance
   *
   * @example
   * ```ts
   * const ads = await client
   *   .query()
   *   .inCountries(['US', 'GB'])
   *   .withSearchTerms('technology')
   *   .ofType('ALL')
   *   .execute();
   * ```
   */
  query(): ChainableQuery {
    return new ChainableQuery(this);
  }

  /**
   * Search the Ads Library with raw parameters.
   * @param params - Query parameters
   * @returns API response with ads data and pagination
   *
   * @example
   * ```ts
   * const response = await client.search({
   *   ad_reached_countries: ['US'],
   *   search_terms: 'coffee',
   *   ad_active_status: 'ACTIVE',
   *   fields: ['id', 'page_name'],
   *   limit: 100,
   * });
   * ```
   */
  async search(params: AdsLibraryQueryParams): Promise<AdsLibraryResponse> {
    const url = this.buildUrl(params);
    const response = await this.makeRequest(url);
    return response;
  }

  /**
   * Fetch the next page of results using a pagination cursor.
   * @param cursor - The 'after' cursor from a previous response
   * @param params - Original query parameters (without the after cursor)
   * @returns Next page of results
   */
  async fetchNextPage(
    cursor: string,
    params: AdsLibraryQueryParams
  ): Promise<AdsLibraryResponse> {
    return this.search({ ...params, after: cursor });
  }

  /**
   * Iterate through all pages of results.
   * @param params - Query parameters
   * @param options - Iteration options
   * @yields Individual ads from all pages
   *
   * @example
   * ```ts
   * for await (const ad of client.iterate(params, { maxResults: 1000 })) {
   *   console.log(ad.page_name);
   * }
   * ```
   */
  async *iterate(
    params: AdsLibraryQueryParams,
    options: IterateOptions = {}
  ): AsyncGenerator<Ad, void, unknown> {
    const { maxResults, delayMs = 0 } = options;
    let cursor: string | undefined;
    let count = 0;

    do {
      const queryParams = cursor ? { ...params, after: cursor } : params;
      const response = await this.search(queryParams);

      for (const ad of response.data) {
        yield ad;
        count++;

        if (maxResults && count >= maxResults) {
          return;
        }
      }

      cursor = response.paging?.cursors?.after;

      if (cursor && delayMs > 0) {
        await this.delay(delayMs);
      }
    } while (cursor);
  }

  /**
   * Fetch all results as an array.
   * Warning: This can be memory-intensive for large result sets.
   * Consider using iterate() for large queries.
   *
   * @param params - Query parameters
   * @param options - Iteration options
   * @returns Array of all ads
   */
  async fetchAll(
    params: AdsLibraryQueryParams,
    options: IterateOptions = {}
  ): Promise<Ad[]> {
    const ads: Ad[] = [];

    for await (const ad of this.iterate(params, options)) {
      ads.push(ad);
    }

    return ads;
  }

  /**
   * Build the full API URL with query parameters.
   */
  private buildUrl(params: AdsLibraryQueryParams): string {
    const url = new URL(
      `${this.baseUrl}/${this.apiVersion}/ads_archive`
    );

    url.searchParams.set('access_token', this.accessToken);
    url.searchParams.set(
      'ad_reached_countries',
      JSON.stringify(params.ad_reached_countries)
    );

    if (params.ad_active_status) {
      url.searchParams.set('ad_active_status', params.ad_active_status);
    }

    if (params.ad_delivery_date_max) {
      url.searchParams.set('ad_delivery_date_max', params.ad_delivery_date_max);
    }

    if (params.ad_delivery_date_min) {
      url.searchParams.set('ad_delivery_date_min', params.ad_delivery_date_min);
    }

    if (params.ad_type) {
      url.searchParams.set('ad_type', params.ad_type);
    }

    if (params.bylines && params.bylines.length > 0) {
      url.searchParams.set('bylines', JSON.stringify(params.bylines));
    }

    if (params.delivery_by_region && params.delivery_by_region.length > 0) {
      url.searchParams.set(
        'delivery_by_region',
        JSON.stringify(params.delivery_by_region)
      );
    }

    if (params.estimated_audience_size_max !== undefined) {
      url.searchParams.set(
        'estimated_audience_size_max',
        String(params.estimated_audience_size_max)
      );
    }

    if (params.estimated_audience_size_min !== undefined) {
      url.searchParams.set(
        'estimated_audience_size_min',
        String(params.estimated_audience_size_min)
      );
    }

    if (params.languages && params.languages.length > 0) {
      url.searchParams.set('languages', JSON.stringify(params.languages));
    }

    if (params.media_type) {
      url.searchParams.set('media_type', params.media_type);
    }

    if (params.publisher_platforms && params.publisher_platforms.length > 0) {
      url.searchParams.set(
        'publisher_platforms',
        JSON.stringify(params.publisher_platforms)
      );
    }

    if (params.search_page_ids && params.search_page_ids.length > 0) {
      url.searchParams.set(
        'search_page_ids',
        JSON.stringify(params.search_page_ids)
      );
    }

    if (params.search_terms) {
      url.searchParams.set('search_terms', params.search_terms);
    }

    if (params.search_type) {
      url.searchParams.set('search_type', params.search_type);
    }

    if (params.unmask_removed_content !== undefined) {
      url.searchParams.set(
        'unmask_removed_content',
        String(params.unmask_removed_content)
      );
    }

    if (params.fields && params.fields.length > 0) {
      url.searchParams.set('fields', params.fields.join(','));
    }

    if (params.limit) {
      url.searchParams.set('limit', String(params.limit));
    }

    if (params.after) {
      url.searchParams.set('after', params.after);
    }

    return url.toString();
  }

  /**
   * Make an HTTP request to the API.
   */
  private async makeRequest(url: string): Promise<AdsLibraryResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json() as AdsLibraryResponse | ApiErrorResponse;

      if (!response.ok || 'error' in data) {
        const errorData = data as ApiErrorResponse;
        throw new ApiRequestError(errorData.error);
      }

      return data as AdsLibraryResponse;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiRequestError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError(`Request timeout after ${this.timeout}ms`);
        }
        throw new NetworkError(error.message);
      }

      throw new NetworkError('Unknown network error');
    }
  }

  /**
   * Delay execution for a specified number of milliseconds.
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Chainable query that combines QueryBuilder with execution.
 * Allows building and executing queries in a single fluent chain.
 */
export class ChainableQuery extends QueryBuilder {
  private readonly client: AdsLibraryClient;

  constructor(client: AdsLibraryClient) {
    super();
    this.client = client;
  }

  /**
   * Execute the query and return the response.
   * @returns API response with ads data and pagination
   */
  async execute(): Promise<AdsLibraryResponse> {
    const params = this.build();
    return this.client.search(params);
  }

  /**
   * Execute the query and return only the ads array.
   * @returns Array of ads from the response
   */
  async getAds(): Promise<Ad[]> {
    const response = await this.execute();
    return response.data;
  }

  /**
   * Execute and iterate through all pages of results.
   * @param options - Iteration options
   * @yields Individual ads from all pages
   */
  async *iterate(options: IterateOptions = {}): AsyncGenerator<Ad, void, unknown> {
    const params = this.build();
    yield* this.client.iterate(params, options);
  }

  /**
   * Execute and fetch all results as an array.
   * @param options - Iteration options
   * @returns Array of all ads
   */
  async fetchAll(options: IterateOptions = {}): Promise<Ad[]> {
    const params = this.build();
    return this.client.fetchAll(params, options);
  }

  /**
   * Get the first ad from the results.
   * @returns First ad or undefined if no results
   */
  async first(): Promise<Ad | undefined> {
    const savedLimit = this.getParams().limit;
    this.limit(1);
    const ads = await this.getAds();
    if (savedLimit !== undefined) {
      this.limit(savedLimit);
    }
    return ads[0];
  }

  /**
   * Count total results (fetches all pages).
   * Warning: This can be slow for large result sets.
   * @param options - Iteration options
   * @returns Total number of ads
   */
  async count(options: IterateOptions = {}): Promise<number> {
    let count = 0;
    for await (const _ of this.iterate(options)) {
      count++;
    }
    return count;
  }
}
