import { describe, it, expect } from 'vitest';
import { QueryBuilder } from '../query-builder.js';
import { ValidationError } from '../errors.js';

describe('QueryBuilder', () => {
  describe('inCountries', () => {
    it('should set ad_reached_countries', () => {
      const builder = new QueryBuilder().inCountries(['US', 'GB']);
      const params = builder.build();
      expect(params.ad_reached_countries).toEqual(['US', 'GB']);
    });
  });

  describe('build', () => {
    it('should throw ValidationError if countries not set', () => {
      const builder = new QueryBuilder();
      expect(() => builder.build()).toThrow(ValidationError);
    });

    it('should throw ValidationError if countries array is empty', () => {
      const builder = new QueryBuilder().inCountries([]);
      expect(() => builder.build()).toThrow(ValidationError);
    });
  });

  describe('search options', () => {
    it('should set search_terms', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .withSearchTerms('coffee');
      const params = builder.build();
      expect(params.search_terms).toBe('coffee');
    });

    it('should set search_type with withExactPhrase', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .withExactPhrase('artificial intelligence');
      const params = builder.build();
      expect(params.search_terms).toBe('artificial intelligence');
      expect(params.search_type).toBe('KEYWORD_EXACT_PHRASE');
    });

    it('should set search_page_ids', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .byPageIds(['123', '456']);
      const params = builder.build();
      expect(params.search_page_ids).toEqual(['123', '456']);
    });
  });

  describe('status filters', () => {
    it('should set ACTIVE status with activeOnly', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .activeOnly();
      const params = builder.build();
      expect(params.ad_active_status).toBe('ACTIVE');
    });

    it('should set INACTIVE status with inactiveOnly', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .inactiveOnly();
      const params = builder.build();
      expect(params.ad_active_status).toBe('INACTIVE');
    });

    it('should set ALL status with allStatuses', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .allStatuses();
      const params = builder.build();
      expect(params.ad_active_status).toBe('ALL');
    });
  });

  describe('date filters', () => {
    it('should set delivery date min', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .deliveredAfter('2024-01-01');
      const params = builder.build();
      expect(params.ad_delivery_date_min).toBe('2024-01-01');
    });

    it('should set delivery date max', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .deliveredBefore('2024-12-31');
      const params = builder.build();
      expect(params.ad_delivery_date_max).toBe('2024-12-31');
    });

    it('should set both dates with deliveredBetween', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .deliveredBetween('2024-01-01', '2024-06-30');
      const params = builder.build();
      expect(params.ad_delivery_date_min).toBe('2024-01-01');
      expect(params.ad_delivery_date_max).toBe('2024-06-30');
    });
  });

  describe('platform filters', () => {
    it('should set publisher_platforms', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .onPlatforms(['FACEBOOK', 'INSTAGRAM']);
      const params = builder.build();
      expect(params.publisher_platforms).toEqual(['FACEBOOK', 'INSTAGRAM']);
    });

    it('should set FACEBOOK with onFacebook', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .onFacebook();
      const params = builder.build();
      expect(params.publisher_platforms).toEqual(['FACEBOOK']);
    });

    it('should set INSTAGRAM with onInstagram', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .onInstagram();
      const params = builder.build();
      expect(params.publisher_platforms).toEqual(['INSTAGRAM']);
    });
  });

  describe('fields', () => {
    it('should set fields', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .withFields(['id', 'page_name']);
      const params = builder.build();
      expect(params.fields).toEqual(['id', 'page_name']);
    });

    it('should set all fields with withAllFields', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .withAllFields();
      const params = builder.build();
      expect(params.fields).toContain('id');
      expect(params.fields).toContain('page_name');
      expect(params.fields).toContain('spend');
      expect(params.fields?.length).toBeGreaterThan(20);
    });
  });

  describe('limit', () => {
    it('should set limit', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .limit(100);
      const params = builder.build();
      expect(params.limit).toBe(100);
    });

    it('should throw ValidationError if limit exceeds 500', () => {
      const builder = new QueryBuilder().inCountries(['US']);
      expect(() => builder.limit(501)).toThrow(ValidationError);
    });
  });

  describe('clone', () => {
    it('should create independent copy', () => {
      const original = new QueryBuilder()
        .inCountries(['US'])
        .withSearchTerms('coffee');
      
      const cloned = original.clone().inCountries(['GB']);
      
      expect(original.build().ad_reached_countries).toEqual(['US']);
      expect(cloned.build().ad_reached_countries).toEqual(['GB']);
    });
  });

  describe('reset', () => {
    it('should clear all parameters', () => {
      const builder = new QueryBuilder()
        .inCountries(['US'])
        .withSearchTerms('coffee')
        .activeOnly();
      
      builder.reset();
      
      expect(() => builder.build()).toThrow(ValidationError);
      expect(builder.getParams()).toEqual({});
    });
  });

  describe('chaining', () => {
    it('should support full chain', () => {
      const params = new QueryBuilder()
        .inCountries(['US', 'GB'])
        .withSearchTerms('technology')
        .ofType('ALL')
        .activeOnly()
        .deliveredAfter('2024-01-01')
        .inLanguages(['en'])
        .onFacebook()
        .withFields(['id', 'page_name'])
        .limit(50)
        .build();

      expect(params.ad_reached_countries).toEqual(['US', 'GB']);
      expect(params.search_terms).toBe('technology');
      expect(params.ad_type).toBe('ALL');
      expect(params.ad_active_status).toBe('ACTIVE');
      expect(params.ad_delivery_date_min).toBe('2024-01-01');
      expect(params.languages).toEqual(['en']);
      expect(params.publisher_platforms).toEqual(['FACEBOOK']);
      expect(params.fields).toEqual(['id', 'page_name']);
      expect(params.limit).toBe(50);
    });
  });
});
