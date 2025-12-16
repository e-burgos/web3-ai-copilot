import NodeCache from 'node-cache';
import { logger } from '../utils/logger';

// Cache configuration
// TTL in seconds
const CACHE_TTL = {
  PORTFOLIO: 30, // 30 seconds
  POSITIONS: 30, // 30 seconds
  NFTS: 60, // 1 minute (NFTs change less frequently)
  TRANSACTIONS: 10, // 10 seconds (transactions are more dynamic)
};

class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 60, // Default TTL: 60 seconds
      checkperiod: 120, // Check for expired keys every 120 seconds
      useClones: false, // Better performance, but be careful with mutations
    });

    // Log cache statistics periodically
    setInterval(() => {
      const stats = this.cache.getStats();
      if (stats.keys > 0) {
        logger.debug('Cache statistics', {
          keys: stats.keys,
          hits: stats.hits,
          misses: stats.misses,
          hitRate: stats.hits / (stats.hits + stats.misses) || 0,
        });
      }
    }, 60000); // Every minute
  }

  /**
   * Generate cache key for Zerion endpoints
   */
  private getKey(
    endpoint: string,
    address: string,
    params?: Record<string, unknown>
  ): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `zerion:${endpoint}:${address}:${paramsStr}`;
  }

  /**
   * Get cached value
   */
  get<T>(
    endpoint: string,
    address: string,
    params?: Record<string, unknown>
  ): T | undefined {
    const key = this.getKey(endpoint, address, params);
    const value = this.cache.get<T>(key);

    if (value) {
      logger.debug('Cache hit', { endpoint, address });
    } else {
      logger.debug('Cache miss', { endpoint, address });
    }

    return value;
  }

  /**
   * Set cached value with appropriate TTL
   */
  set(
    endpoint: string,
    address: string,
    value: unknown,
    params?: Record<string, unknown>
  ): void {
    const key = this.getKey(endpoint, address, params);
    let ttl = CACHE_TTL.POSITIONS; // Default

    // Set TTL based on endpoint type
    if (endpoint.includes('portfolio')) {
      ttl = CACHE_TTL.PORTFOLIO;
    } else if (endpoint.includes('nfts') || endpoint.includes('nft')) {
      ttl = CACHE_TTL.NFTS;
    } else if (endpoint.includes('transactions')) {
      ttl = CACHE_TTL.TRANSACTIONS;
    }

    this.cache.set(key, value, ttl);
    logger.debug('Cache set', { endpoint, address, ttl });
  }

  /**
   * Clear cache for a specific address (useful when data might have changed)
   */
  clearAddress(address: string): void {
    const keys = this.cache.keys();
    const addressKeys = keys.filter((key) => key.includes(`:${address}:`));
    this.cache.del(addressKeys);
    logger.info('Cache cleared for address', {
      address,
      keysDeleted: addressKeys.length,
    });
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.flushAll();
    logger.info('Cache cleared');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats();
  }
}

export const cacheService = new CacheService();
