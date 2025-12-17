# Meta Ads Library SDK

A modern, type-safe TypeScript SDK for the Facebook/Meta Ads Library API with a fluent chainable interface.

[![npm version](https://img.shields.io/npm/v/meta-ads-library.svg)](https://www.npmjs.com/package/meta-ads-library)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔗 **Fluent Chainable API** - Build queries with an intuitive method chaining pattern
- 📦 **Zero Dependencies** - Uses native `fetch` (Node.js 18+)
- 🔒 **Type-Safe** - Full TypeScript support with comprehensive type definitions
- 📄 **Pagination Support** - Built-in async iteration for handling large result sets
- ⚡ **Modern ESM & CJS** - Supports both module systems
- 🛡️ **Error Handling** - Typed error classes for better error management

## Installation

```bash
npm install meta-ads-library
```

```bash
yarn add meta-ads-library
```

```bash
pnpm add meta-ads-library
```

## Requirements

- Node.js 18.0.0 or higher
- Facebook Access Token with Ads Library API access

## Quick Start

```typescript
import { AdsLibraryClient } from 'meta-ads-library';

const client = new AdsLibraryClient({
  accessToken: 'your-facebook-access-token',
});

// Search for ads using the fluent API
const response = await client
  .query()
  .inCountries(['US'])
  .withSearchTerms('coffee')
  .activeOnly()
  .withFields(['id', 'page_name', 'ad_creative_bodies', 'spend'])
  .limit(100)
  .execute();

console.log(response.data); // Array of ads
```

## Getting an Access Token

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create or select an app
3. Navigate to the [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
4. Generate a User Access Token
5. For production, use a long-lived token or implement OAuth flow

> **Note:** The Ads Library API may require additional app review for full access depending on your use case.

## Usage

### Creating a Client

```typescript
import { AdsLibraryClient, createClient } from 'meta-ads-library';

// Using the class
const client = new AdsLibraryClient({
  accessToken: 'your-token',
  apiVersion: 'v24.0',    // Optional, defaults to v24.0
  timeout: 30000,          // Optional, defaults to 30000ms
});

// Using the helper function
const client2 = createClient('your-token', {
  apiVersion: 'v24.0',
});
```

### Fluent Query Builder

The SDK provides a fluent API for building queries:

```typescript
const ads = await client
  .query()
  // Required: Set target countries
  .inCountries(['US', 'GB', 'CA'])
  
  // Search options
  .withSearchTerms('technology')        // Search by keywords
  .withExactPhrase('artificial intelligence')  // Exact phrase match
  .byPageIds(['123456789'])             // Search by Page IDs
  
  // Filters
  .ofType('ALL')                        // 'ALL' or 'POLITICAL_AND_ISSUE_ADS'
  .activeOnly()                         // Only active ads
  .inactiveOnly()                       // Only inactive ads
  .allStatuses()                        // Both active and inactive
  
  // Date filters
  .deliveredAfter('2024-01-01')
  .deliveredBefore('2024-12-31')
  .deliveredBetween('2024-01-01', '2024-06-30')
  
  // Additional filters
  .inRegions(['California', 'New York'])
  .inLanguages(['en', 'es'])
  .withMediaType('VIDEO')               // 'ALL', 'IMAGE', 'VIDEO', 'MEME', 'NONE'
  .onPlatforms(['FACEBOOK', 'INSTAGRAM'])
  .onFacebook()                         // Shortcut for Facebook only
  .onInstagram()                        // Shortcut for Instagram only
  .withAudienceSize(1000, 100000)       // Min and max audience size
  .withBylines(['Paid for by Example']) // Filter by disclaimers
  
  // Response options
  .withFields(['id', 'page_name', 'ad_creative_bodies', 'spend'])
  .withAllFields()                      // Request all available fields
  .limit(100)                           // Results per page (max 500)
  
  // Execute
  .execute();                           // Returns full response
  // OR
  .getAds();                            // Returns just the ads array
```

### Available Fields

```typescript
type AdField =
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
```

### Pagination

#### Manual Pagination

```typescript
const response = await client
  .query()
  .inCountries(['US'])
  .withSearchTerms('coffee')
  .limit(100)
  .execute();

// Check for next page
if (response.paging?.cursors?.after) {
  const nextPage = await client
    .query()
    .inCountries(['US'])
    .withSearchTerms('coffee')
    .limit(100)
    .after(response.paging.cursors.after)
    .execute();
}
```

#### Async Iteration (Recommended for Large Datasets)

```typescript
// Iterate through all results
for await (const ad of client.query()
  .inCountries(['US'])
  .withSearchTerms('coffee')
  .iterate({ maxResults: 1000, delayMs: 100 })) {
  console.log(ad.page_name);
}

// Or fetch all at once (careful with memory)
const allAds = await client
  .query()
  .inCountries(['US'])
  .withSearchTerms('coffee')
  .fetchAll({ maxResults: 500 });
```

### Using Raw Parameters

```typescript
const response = await client.search({
  ad_reached_countries: ['US'],
  search_terms: 'coffee',
  ad_active_status: 'ACTIVE',
  ad_type: 'ALL',
  fields: ['id', 'page_name', 'ad_creative_bodies'],
  limit: 100,
});
```

### Error Handling

```typescript
import {
  AdsLibraryClient,
  ApiRequestError,
  ValidationError,
  NetworkError,
} from 'meta-ads-library';

try {
  const ads = await client
    .query()
    .inCountries(['US'])
    .withSearchTerms('coffee')
    .execute();
} catch (error) {
  if (error instanceof ApiRequestError) {
    // API returned an error
    console.error('API Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Type:', error.type);
  } else if (error instanceof ValidationError) {
    // Invalid parameters
    console.error('Validation Error:', error.message);
  } else if (error instanceof NetworkError) {
    // Network issues (timeout, connection, etc.)
    console.error('Network Error:', error.message);
  }
}
```

### Standalone Query Builder

You can also use the QueryBuilder separately:

```typescript
import { QueryBuilder } from 'meta-ads-library';

const builder = new QueryBuilder()
  .inCountries(['US'])
  .withSearchTerms('technology')
  .activeOnly();

// Clone and modify
const euBuilder = builder.clone().inCountries(['DE', 'FR']);

// Get params without executing
const params = builder.build();
console.log(params);
```

## API Reference

### AdsLibraryClient

| Method | Description |
|--------|-------------|
| `query()` | Creates a new chainable query builder |
| `search(params)` | Execute a search with raw parameters |
| `fetchNextPage(cursor, params)` | Fetch the next page of results |
| `iterate(params, options)` | Async generator for all results |
| `fetchAll(params, options)` | Fetch all results as an array |

### ChainableQuery Methods

| Method | Description |
|--------|-------------|
| `inCountries(countries)` | Set target countries (required) |
| `withSearchTerms(terms)` | Search by keywords |
| `withExactPhrase(phrase)` | Search for exact phrase |
| `byPageIds(pageIds)` | Search by Page IDs |
| `ofType(type)` | Set ad type filter |
| `activeOnly()` | Only active ads |
| `inactiveOnly()` | Only inactive ads |
| `deliveredAfter(date)` | Filter by min date |
| `deliveredBefore(date)` | Filter by max date |
| `withFields(fields)` | Select response fields |
| `limit(count)` | Set results per page |
| `execute()` | Execute and return response |
| `getAds()` | Execute and return ads array |
| `iterate(options)` | Async iterate through all |
| `fetchAll(options)` | Fetch all as array |
| `first()` | Get first result |
| `count(options)` | Count total results |

## Regional Availability

| Ad Type | Availability |
|---------|--------------|
| `POLITICAL_AND_ISSUE_ADS` | Worldwide |
| `ALL` | EU and UK only |

## Rate Limits

The Ads Library API has rate limits. Consider:
- Using `delayMs` option when iterating
- Implementing retry logic with exponential backoff
- Caching results when appropriate

## TypeScript Support

This package is written in TypeScript and provides full type definitions:

```typescript
import type {
  Ad,
  AdsLibraryResponse,
  AdsLibraryQueryParams,
  AdField,
  InsightsRangeValue,
} from 'meta-ads-library';
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This is an **unofficial** SDK and is not affiliated with, endorsed by, or in any way officially connected with Meta Platforms, Inc. (formerly Facebook, Inc.) or any of its subsidiaries or affiliates.

The official Meta/Facebook website can be found at [https://www.facebook.com](https://www.facebook.com). The names "Facebook," "Meta," and related trademarks are registered trademarks of Meta Platforms, Inc.

**By using this SDK, you agree to:**
- Comply with [Meta's Terms of Service](https://www.facebook.com/terms.php)
- Comply with [Meta Platform Terms](https://developers.facebook.com/terms/)
- Comply with [Ad Library API Terms](https://www.facebook.com/ads/library/api/)
- Use the data responsibly and in accordance with applicable laws

The authors of this package are not responsible for any misuse or any violations of Meta's terms of service.

## License

MIT ©

## Links

- [Facebook Ad Library](https://www.facebook.com/ads/library/)
- [Ad Library API Documentation](https://www.facebook.com/ads/library/api/)
- [Meta for Developers](https://developers.facebook.com/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
