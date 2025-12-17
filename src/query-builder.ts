import type {
  AdActiveStatus,
  AdField,
  AdsLibraryQueryParams,
  AdType,
  MediaType,
  PublisherPlatform,
  SearchType,
  AdReachedCountry,
} from './types.js';
import { EU_COUNTRIES } from './types.js';
import { ValidationError } from './errors.js';

/**
 * Fluent query builder for constructing Ads Library API queries.
 * Supports method chaining for a clean, readable API.
 *
 * @example
 * ```ts
 * const query = new QueryBuilder()
 *   .inCountries(['US', 'GB'])
 *   .withSearchTerms('coffee')
 *   .ofType('ALL')
 *   .activeOnly()
 *   .withFields(['id', 'page_name', 'ad_creative_bodies'])
 *   .limit(100)
 *   .build();
 * ```
 */
export class QueryBuilder {
  private params: Partial<AdsLibraryQueryParams> = {};

  /**
   * Set the countries where ads were delivered (required).
   * 
   * Search ALL or by ISO country code to return ads that reached specific countries or 
   * locations. Note: Ads that did not reach any location in the EU will only return if 
   * they are about social issues, elections or politics.
   * 
   * @param countries - Array of ISO 3166-1 alpha-2 country codes
   */
  inCountries(countries: AdReachedCountry[]): this {
    this.params.ad_reached_countries = countries;
    return this;
  }

  /**
   * Set the target countries to all EU member states.
   * Includes all 27 EU countries: AT, BE, BG, HR, CY, CZ, DK, EE, FI, FR, DE, GR, HU, IE, IT, LV, LT, LU, MT, NL, PL, PT, RO, SK, SI, ES, SE
   */
  inEU(): this {
    this.params.ad_reached_countries = [...EU_COUNTRIES];
    return this;
  }

  /**
   * Set the target countries to all EU member states plus the United Kingdom.
   * Includes all 27 EU countries + GB
   */
  inEUAndUK(): this {
    this.params.ad_reached_countries = [...EU_COUNTRIES, 'GB'];
    return this;
  }

  /**
   * Set the ad type to search.
   * @param type - Ad type filter
   */
  ofType(type: AdType): this {
    this.params.ad_type = type;
    return this;
  }

  /**
   * Alias for ofType - set ad type.
   * @param type - Ad type filter
   */
  adType(type: AdType): this {
    return this.ofType(type);
  }

  /**
   * Search for ads containing specific terms.
   * @param terms - Search keywords
   * @param searchType - How to match search terms (default: KEYWORD_UNORDERED)
   */
  withSearchTerms(terms: string, searchType?: SearchType): this {
    this.params.search_terms = terms;
    if (searchType) {
      this.params.search_type = searchType;
    }
    return this;
  }

  /**
   * Alias for withSearchTerms - search by keywords.
   * @param terms - Search keywords
   */
  search(terms: string): this {
    return this.withSearchTerms(terms);
  }

  /**
   * Search for exact phrase match.
   * @param phrase - Exact phrase to search
   */
  withExactPhrase(phrase: string): this {
    return this.withSearchTerms(phrase, 'KEYWORD_EXACT_PHRASE');
  }

  /**
   * Search by specific Page IDs.
   * @param pageIds - Array of Facebook Page IDs
   */
  byPageIds(pageIds: number[]): this {
    this.params.search_page_ids = pageIds;
    return this;
  }

  /**
   * Alias for byPageIds - search by page IDs.
   * @param pageIds - Array of Facebook Page IDs
   */
  fromPages(pageIds: number[]): this {
    return this.byPageIds(pageIds);
  }

  /**
   * Filter by ad active status.
   * @param status - Active status filter
   */
  withStatus(status: AdActiveStatus): this {
    this.params.ad_active_status = status;
    return this;
  }

  /**
   * Only return currently active ads.
   */
  activeOnly(): this {
    return this.withStatus('ACTIVE');
  }

  /**
   * Only return inactive ads.
   */
  inactiveOnly(): this {
    return this.withStatus('INACTIVE');
  }

  /**
   * Return both active and inactive ads.
   */
  allStatuses(): this {
    return this.withStatus('ALL');
  }

  /**
   * Filter by minimum delivery date.
   * 
   * Search for ads delivered after the date (inclusive) you provide.
   * 
   * @param date - Date string in YYYY-MM-DD format
   */
  deliveredAfter(date: string): this {
    this.params.ad_delivery_date_min = date;
    return this;
  }

  /**
   * Filter by maximum delivery date.
   * 
   * Search for ads delivered before the date (inclusive) you provide.
   * 
   * @param date - Date string in YYYY-MM-DD format
   */
  deliveredBefore(date: string): this {
    this.params.ad_delivery_date_max = date;
    return this;
  }

  /**
   * Filter by delivery date range.
   * 
   * Search for ads delivered between the start and end dates (inclusive).
   * @param startDate - Start date in YYYY-MM-DD format
   * @param endDate - End date in YYYY-MM-DD format
   */
  deliveredBetween(startDate: string, endDate: string): this {
    this.params.ad_delivery_date_min = startDate;
    this.params.ad_delivery_date_max = endDate;
    return this;
  }

  /**
   * Filter by bylines (paid for by disclaimers).
   * 
   * Filter results for ads with a paid for by disclaimer byline, such as political ads that reference “immigration” paid for by “ACLU”. Provide a JSON array to search for a byline without a comma or one with a comma. For instance ?bylines=["byline, with a comma,","byline without a comma"] returns results with either text variation. You must list the complete byline. For example, 'Maria' would not return ads with the byline 'Maria C. Lee for America.' 
   * Available only for POLITICAL_AND_ISSUE_ADS
   * 
   * @param bylines - Array of byline strings
   */
  withBylines(bylines: string[]): this {
    this.params.bylines = bylines;
    return this;
  }

  /**
   * Filter by delivery regions within countries.
   * Search for ads delivered within specific regions of countries. For example, to search for ads delivered in California within the United States, use ['California'].
   *
   * @param regions - Array of region names (e.g., ['California', 'New York'])
   * @note Available only for POLITICAL_AND_ISSUE_ADS
   */
  inRegions(regions: string[]): this {
    this.params.delivery_by_region = regions;
    return this;
  }

  /**
   * Filter by estimated audience size range.
   * @param min - Minimum audience size
   * @param max - Maximum audience size (optional)
   */
  withAudienceSize(min: number, max?: number): this {
    this.params.estimated_audience_size_min = min;
    if (max !== undefined) {
      this.params.estimated_audience_size_max = max;
    }
    return this;
  }

  /**
   * Filter by languages.
   * @param languages - Array of ISO 639-1 language codes
   */
  inLanguages(languages: string[]): this {
    this.params.languages = languages.map((l) => l.toLowerCase());
    return this;
  }

  /**
   * Filter by media type.
   * @param type - Media type filter
   */
  withMediaType(type: MediaType): this {
    this.params.media_type = type;
    return this;
  }

  /**
   * Filter by publisher platforms.
   * @param platforms - Array of platform names
   */
  onPlatforms(platforms: PublisherPlatform[]): this {
    this.params.publisher_platforms = platforms;
    return this;
  }

  /**
   * Only return Facebook ads.
   */
  onFacebook(): this {
    return this.onPlatforms(['FACEBOOK']);
  }

  /**
   * Only return Instagram ads.
   */
  onInstagram(): this {
    return this.onPlatforms(['INSTAGRAM']);
  }

  /**
   * Specify which fields to include in the response.
   * @param fields - Array of field names
   */
  withFields(fields: AdField[]): this {
    this.params.fields = fields;
    return this;
  }

  /**
   * Alias for withFields - select response fields.
   * @param fields - Array of field names
   */
  select(fields: AdField[]): this {
    return this.withFields(fields);
  }

  /**
   * Include all available fields in the response.
   */
  withAllFields(): this {
    return this.withFields([
      'id',
      'ad_creation_time',
      'ad_creative_bodies',
      'ad_creative_link_captions',
      'ad_creative_link_descriptions',
      'ad_creative_link_titles',
      'ad_delivery_start_time',
      'ad_delivery_stop_time',
      'ad_snapshot_url',
      'age_country_gender_reach_breakdown',
      'beneficiary_payers',
      'br_total_reach',
      'bylines',
      'currency',
      'delivery_by_region',
      'demographic_distribution',
      'estimated_audience_size',
      'eu_total_reach',
      'impressions',
      'languages',
      'page_id',
      'page_name',
      'publisher_platforms',
      'spend',
      'target_ages',
      'target_gender',
      'target_locations',
      'total_reach_by_location',
    ]);
  }

  /**
   * Unmask removed content (if you have permission).
   * @param unmask - Whether to unmask removed content
   */
  unmaskRemovedContent(unmask = true): this {
    this.params.unmask_removed_content = unmask;
    return this;
  }

  /**
   * Set the number of results per page.
   * @param count - Number of results (max 500)
   */
  limit(count: number): this {
    if (count > 500) {
      throw new ValidationError('Limit cannot exceed 500');
    }
    this.params.limit = count;
    return this;
  }

  /**
   * Set pagination cursor for fetching next page.
   * @param cursor - Pagination cursor from previous response
   */
  after(cursor: string): this {
    this.params.after = cursor;
    return this;
  }

  /**
   * Build and validate the query parameters.
   * @returns Validated query parameters
   * @throws ValidationError if required parameters are missing
   */
  build(): AdsLibraryQueryParams {
    if (
      !this.params.ad_reached_countries ||
      this.params.ad_reached_countries.length === 0
    ) {
      throw new ValidationError(
        'ad_reached_countries is required. Use .inCountries() to set it.'
      );
    }

    return {
      ...this.params,
      ad_reached_countries: this.params.ad_reached_countries,
    } as AdsLibraryQueryParams;
  }

  /**
   * Get the current parameters without validation.
   * Useful for debugging or partial queries.
   */
  getParams(): Partial<AdsLibraryQueryParams> {
    return { ...this.params };
  }

  /**
   * Reset the query builder to initial state.
   */
  reset(): this {
    this.params = {};
    return this;
  }

  /**
   * Clone this query builder.
   */
  clone(): QueryBuilder {
    const cloned = new QueryBuilder();
    cloned.params = { ...this.params };
    if (this.params.ad_reached_countries) {
      cloned.params.ad_reached_countries = [...this.params.ad_reached_countries];
    }
    if (this.params.fields) {
      cloned.params.fields = [...this.params.fields];
    }
    if (this.params.bylines) {
      cloned.params.bylines = [...this.params.bylines];
    }
    if (this.params.delivery_by_region) {
      cloned.params.delivery_by_region = [...this.params.delivery_by_region];
    }
    if (this.params.languages) {
      cloned.params.languages = [...this.params.languages];
    }
    if (this.params.publisher_platforms) {
      cloned.params.publisher_platforms = [...this.params.publisher_platforms];
    }
    if (this.params.search_page_ids) {
      cloned.params.search_page_ids = [...this.params.search_page_ids];
    }
    return cloned;
  }
}
