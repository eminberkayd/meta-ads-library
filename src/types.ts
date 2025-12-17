/**
 * Facebook/Meta Ads Library API Type Definitions
 */

// ============================================================================
// API Configuration
// ============================================================================

export interface AdsLibraryConfig {
  /** Facebook Graph API access token */
  accessToken: string;
  /** API version (default: v24.0) */
  apiVersion?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Base URL for the Graph API (default: https://graph.facebook.com) */
  baseUrl?: string;
}

// ============================================================================
// Query Parameters
// ============================================================================

/** Active status filter for ads */
export type AdActiveStatus = 'ACTIVE' | 'INACTIVE' | 'ALL';

/** Type of ads to search */
export type AdType = 'ALL' | 'EMPLOYMENT_ADS' | 'FINANCIAL_PRODUCTS_AND_SERVICES_ADS' | 'HOUSING_ADS' | 'POLITICAL_AND_ISSUE_ADS';

/** Media type filter */
export type MediaType = 'ALL' | 'IMAGE' | 'MEME' | 'VIDEO' | 'NONE';

/** Publisher platform filter */
export type PublisherPlatform = 'FACEBOOK' | 'INSTAGRAM' | 'AUDIENCE_NETWORK' | 'MESSENGER' | 'WHATSAPP' | 'THREADS' | 'OCULUS';

/** Search type for search terms */
export type SearchType = 'KEYWORD_UNORDERED' | 'KEYWORD_EXACT_PHRASE';

/** Available fields to request from the API */
export type AdField =
  | 'id'
  | 'ad_creation_time'
  | 'ad_creative_bodies'
  | 'ad_creative_link_captions'
  | 'ad_creative_link_descriptions'
  | 'ad_creative_link_titles'
  | 'ad_delivery_start_time'
  | 'ad_delivery_stop_time'
  | 'ad_snapshot_url'
  | 'age_country_gender_reach_breakdown'
  | 'beneficiary_payers'
  | 'br_total_reach'
  | 'bylines'
  | 'currency'
  | 'delivery_by_region'
  | 'demographic_distribution'
  | 'estimated_audience_size'
  | 'eu_total_reach'
  | 'impressions'
  | 'languages'
  | 'page_id'
  | 'page_name'
  | 'publisher_platforms'
  | 'spend'
  | 'target_ages'
  | 'target_gender'
  | 'target_locations'
  | 'total_reach_by_location';

export type AdReachedCountry =
  | 'ALL' | 'BR' | 'IN' | 'GB' | 'US' | 'CA' | 'AR' | 'AU' | 'AT' | 'BE' | 'CL' | 'CN' | 'CO' | 'HR' | 'DK' | 'DO' | 'EG' | 'FI' | 'FR' | 'DE'
  | 'GR' | 'HK' | 'ID' | 'IE' | 'IL' | 'IT' | 'JP' | 'JO' | 'KW' | 'LB' | 'MY' | 'MX' | 'NL' | 'NZ' | 'NG' | 'NO' | 'PK' | 'PA' | 'PE' | 'PH'
  | 'PL' | 'RU' | 'SA' | 'RS' | 'SG' | 'ZA' | 'KR' | 'ES' | 'SE' | 'CH' | 'TW' | 'TH' | 'TR' | 'AE' | 'VE' | 'PT' | 'LU' | 'BG' | 'CZ' | 'SI'
  | 'IS' | 'SK' | 'LT' | 'TT' | 'BD' | 'LK' | 'KE' | 'HU' | 'MA' | 'CY' | 'JM' | 'EC' | 'RO' | 'BO' | 'GT' | 'CR' | 'QA' | 'SV' | 'HN' | 'NI'
  | 'PY' | 'UY' | 'PR' | 'BA' | 'PS' | 'TN' | 'BH' | 'VN' | 'GH' | 'MU' | 'UA' | 'MT' | 'BS' | 'MV' | 'OM' | 'MK' | 'LV' | 'EE' | 'IQ' | 'DZ'
  | 'AL' | 'NP' | 'MO' | 'ME' | 'SN' | 'GE' | 'BN' | 'UG' | 'GP' | 'BB' | 'AZ' | 'TZ' | 'LY' | 'MQ' | 'CM' | 'BW' | 'ET' | 'KZ' | 'NA' | 'MG'
  | 'NC' | 'MD' | 'FJ' | 'BY' | 'JE' | 'GU' | 'YE' | 'ZM' | 'IM' | 'HT' | 'KH' | 'AW' | 'PF' | 'AF' | 'BM' | 'GY' | 'AM' | 'MW' | 'AG' | 'RW'
  | 'GG' | 'GM' | 'FO' | 'LC' | 'KY' | 'BJ' | 'AD' | 'GD' | 'VI' | 'BZ' | 'VC' | 'MN' | 'MZ' | 'ML' | 'AO' | 'GF' | 'UZ' | 'DJ' | 'BF' | 'MC'
  | 'TG' | 'GL' | 'GA' | 'GI' | 'CD' | 'KG' | 'PG' | 'BT' | 'KN' | 'SZ' | 'LS' | 'LA' | 'LI' | 'MP' | 'SR' | 'SC' | 'VG' | 'TC' | 'DM' | 'MR'
  | 'AX' | 'SM' | 'SL' | 'NE' | 'CG' | 'AI' | 'YT' | 'CV' | 'GN' | 'TM' | 'BI' | 'TJ' | 'VU' | 'SB' | 'ER' | 'WS' | 'AS' | 'FK' | 'GQ' | 'TO'
  | 'KM' | 'PW' | 'FM' | 'CF' | 'SO' | 'MH' | 'VA' | 'TD' | 'KI' | 'ST' | 'TV' | 'NR' | 'RE' | 'LR' | 'ZW' | 'CI' | 'MM' | 'AN' | 'AQ' | 'BQ'
  | 'BV' | 'IO' | 'CX' | 'CC' | 'CK' | 'CW' | 'TF' | 'GW' | 'HM' | 'XK' | 'MS' | 'NU' | 'NF' | 'PN' | 'BL' | 'SH' | 'MF' | 'PM' | 'SX' | 'GS'
  | 'SS' | 'SJ' | 'TL' | 'TK' | 'UM' | 'WF' | 'EH' | 'SY';

/** EU member state country codes */
export const EU_COUNTRIES: AdReachedCountry[] = [
  'AT', // Austria
  'BE', // Belgium
  'BG', // Bulgaria
  'HR', // Croatia
  'CY', // Cyprus
  'CZ', // Czech Republic
  'DK', // Denmark
  'EE', // Estonia
  'FI', // Finland
  'FR', // France
  'DE', // Germany
  'GR', // Greece
  'HU', // Hungary
  'IE', // Ireland
  'IT', // Italy
  'LV', // Latvia
  'LT', // Lithuania
  'LU', // Luxembourg
  'MT', // Malta
  'NL', // Netherlands
  'PL', // Poland
  'PT', // Portugal
  'RO', // Romania
  'SK', // Slovakia
  'SI', // Slovenia
  'ES', // Spain
  'SE', // Sweden
];

/** Query parameters for the Ads Library API */
export interface AdsLibraryQueryParams {
  /** Filter by ad active status */
  ad_active_status?: AdActiveStatus;
  /** Maximum delivery date (YYYY-MM-DD) */
  ad_delivery_date_max?: string;
  /** Minimum delivery date (YYYY-MM-DD) */
  ad_delivery_date_min?: string;
  /** Countries where ad was delivered (ISO country codes) */
  ad_reached_countries: AdReachedCountry[];
  /** Type of ads to search */
  ad_type?: AdType;
  /** Filter by bylines (paid for by disclaimers) */
  bylines?: string[];
  /** Filter by delivery regions */
  delivery_by_region?: string[];
  /** Maximum estimated audience size */
  estimated_audience_size_max?: number;
  /** Minimum estimated audience size */
  estimated_audience_size_min?: number;
  /** Filter by languages (ISO 639-1 codes) */
  languages?: string[];
  /** Filter by media type */
  media_type?: MediaType;
  /** Filter by publisher platforms */
  publisher_platforms?: PublisherPlatform[];
  /** Search by Page IDs */
  search_page_ids?: number[];
  /** Search terms (keywords) */
  search_terms?: string;
  /** Search type for search terms */
  search_type?: SearchType;
  /** Unmask removed content */
  unmask_removed_content?: boolean;
  /** Fields to include in response */
  fields?: AdField[];
  /** Number of results per page (max 500) */
  limit?: number;
  /** Pagination cursor */
  after?: string;
}

// ============================================================================
// Response Types
// ============================================================================

/** Range value (min/max) used for spend and impressions */
export interface InsightsRangeValue {
  lower_bound?: string;
  upper_bound?: string;
}

/** Audience distribution by demographic or region */
export interface AudienceDistribution {
  percentage: string;
  region?: string;
  age?: string;
  gender?: string;
}

/** Age, country, and gender reach breakdown */
export interface AgeCountryGenderReachBreakdown {
  age_range?: string;
  country?: string;
  female?: number;
  male?: number;
  unknown?: number;
}

/** Beneficiary and payer information (EU only) */
export interface BeneficiaryPayer {
  beneficiary?: string;
  payer?: string;
}

/** Target location information */
export interface TargetLocation {
  excluded?: boolean;
  name?: string;
  num_obfuscated?: number;
}

/** Single ad record from the Ads Library */
export interface Ad {
  /** Unique identifier for the ad */
  id: string;
  /** Time the ad was created (UTC) */
  ad_creation_time?: string;
  /** Array of ad creative body texts */
  ad_creative_bodies?: string[];
  /** Array of link captions */
  ad_creative_link_captions?: string[];
  /** Array of link descriptions */
  ad_creative_link_descriptions?: string[];
  /** Array of link titles */
  ad_creative_link_titles?: string[];
  /** Time ad delivery started (UTC) */
  ad_delivery_start_time?: string;
  /** Time ad delivery stopped (UTC) */
  ad_delivery_stop_time?: string;
  /** URL to view ad snapshot */
  ad_snapshot_url?: string;
  /** Reach breakdown by age, country, and gender */
  age_country_gender_reach_breakdown?: AgeCountryGenderReachBreakdown[];
  /** Beneficiary and payer info (EU only) */
  beneficiary_payers?: BeneficiaryPayer[];
  /** Total reach in Brazil */
  br_total_reach?: number;
  /** Paid for by disclaimers */
  bylines?: string;
  /** Currency code for spend */
  currency?: string;
  /** Delivery distribution by region */
  delivery_by_region?: AudienceDistribution[];
  /** Demographic distribution of reach */
  demographic_distribution?: AudienceDistribution[];
  /** Estimated audience size range */
  estimated_audience_size?: InsightsRangeValue;
  /** Total reach in EU */
  eu_total_reach?: number;
  /** Impressions range */
  impressions?: InsightsRangeValue;
  /** Languages the ad was shown in */
  languages?: string[];
  /** Page ID of the advertiser */
  page_id?: string;
  /** Page name of the advertiser */
  page_name?: string;
  /** Platforms where ad was published */
  publisher_platforms?: PublisherPlatform[];
  /** Spend range */
  spend?: InsightsRangeValue;
  /** Target age ranges */
  target_ages?: string[];
  /** Target gender */
  target_gender?: string;
  /** Target locations */
  target_locations?: TargetLocation[];
  /** Total reach by location (EU, BR, UK) */
  total_reach_by_location?: Record<string, number>;
}

/** Pagination cursors */
export interface PagingCursors {
  before?: string;
  after?: string;
}

/** Pagination information */
export interface Paging {
  cursors?: PagingCursors;
  next?: string;
  previous?: string;
}

/** API response from the Ads Library */
export interface AdsLibraryResponse {
  data: Ad[];
  paging?: Paging;
}

/** Error response from the API */
export interface ApiError {
  message: string;
  type: string;
  code: number;
  error_subcode?: number;
  fbtrace_id?: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}

// ============================================================================
// SDK Types
// ============================================================================

/** Options for iterating through all results */
export interface IterateOptions {
  /** Maximum total results to fetch (default: unlimited) */
  maxResults?: number;
  /** Delay between requests in ms (default: 0) */
  delayMs?: number;
}
