import { ZerionPaginationInfo } from '../types/pagination';

/**
 * Extracts the cursor from Zerion's next page URL
 * @param nextUrl - The next page URL from Zerion API links.next
 * @returns The cursor string or undefined if not found
 */
export function extractCursorFromUrl(nextUrl: string): string | undefined {
  try {
    const url = new URL(nextUrl);
    return url.searchParams.get('page[after]') || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Interface for Zerion API responses that support pagination
 */
export interface ZerionPaginatedResponse {
  links?: {
    next?: string;
    prev?: string;
  };
  meta?: {
    total_count?: number;
    total_records?: number;
    total_pages?: number;
    current_page?: number;
  };
}

/**
 * Calculates pagination info from a Zerion API response
 * @param response - Zerion API response with links and meta
 * @param pageSize - Current page size
 * @returns Pagination information
 */
export function calculatePaginationInfo(
  response: ZerionPaginatedResponse,
  pageSize: number
): ZerionPaginationInfo {
  const totalCount =
    response.meta?.total_count ?? response.meta?.total_records ?? 0;
  const totalPages =
    response.meta?.total_pages ?? Math.ceil(totalCount / pageSize);
  const hasNext = !!response.links?.next;

  const nextUrl = response.links?.next;
  return {
    totalCount,
    pageCount: totalPages,
    pageSize,
    hasNext,
    nextCursor: nextUrl ? extractCursorFromUrl(nextUrl) : undefined,
  };
}

/**
 * Cache for storing cursors by page index
 * This allows jumping to specific pages without fetching all previous pages
 */
class CursorCache {
  private cursors: Map<number, string> = new Map();

  /**
   * Stores a cursor for a specific page index
   */
  set(pageIndex: number, cursor: string): void {
    this.cursors.set(pageIndex, cursor);
  }

  /**
   * Retrieves a cursor for a specific page index
   */
  get(pageIndex: number): string | undefined {
    return this.cursors.get(pageIndex);
  }

  /**
   * Clears all cached cursors
   */
  clear(): void {
    this.cursors.clear();
  }

  /**
   * Gets the closest cached cursor before the target page
   * This helps optimize pagination by starting from a known cursor
   */
  getClosestCursor(targetPageIndex: number): {
    cursor: string;
    startPageIndex: number;
  } | null {
    let closestPageIndex = -1;
    let closestCursor: string | undefined;

    const entries = Array.from(this.cursors.entries());
    for (const [pageIndex, cursor] of entries) {
      if (pageIndex < targetPageIndex && pageIndex > closestPageIndex) {
        closestPageIndex = pageIndex;
        closestCursor = cursor;
      }
    }

    if (closestCursor && closestPageIndex >= 0) {
      return {
        cursor: closestCursor,
        startPageIndex: closestPageIndex,
      };
    }

    return null;
  }
}

/**
 * Global cursor cache instance
 * Can be cleared when needed (e.g., when address changes)
 */
export const cursorCache = new CursorCache();

/**
 * Options for fetching a paginated page from Zerion
 */
export interface ZerionPageOptions {
  pageSize: number;
  pageIndex: number;
  cursor?: string;
}

/**
 * Result of fetching a page with pagination info
 */
export interface ZerionPageResult<T> {
  data: T[];
  pagination: ZerionPaginationInfo;
  nextCursor?: string;
}

/**
 * Helper to build Zerion page parameters
 * @param options - Page options
 * @returns Zerion page parameters object
 */
export function buildZerionPageParams(options: ZerionPageOptions): {
  size: number;
  after?: string;
} {
  return {
    size: options.pageSize,
    ...(options.cursor ? { after: options.cursor } : {}),
  };
}

/**
 * Processes a Zerion API response and extracts pagination info
 * Also caches the cursor for the next page if available
 * @param response - Zerion API response
 * @param pageIndex - Current page index
 * @param pageSize - Page size
 * @param dataMapper - Function to map Zerion data to app data format
 * @returns Processed page result with data and pagination
 */
export function processZerionPage<TInput, TOutput>(
  response: ZerionPaginatedResponse & { data: TInput[] },
  pageIndex: number,
  pageSize: number,
  dataMapper: (data: TInput[]) => TOutput[]
): ZerionPageResult<TOutput> {
  const pagination = calculatePaginationInfo(response, pageSize);

  // Cache the cursor for the next page if available
  if (pagination.nextCursor) {
    cursorCache.set(pageIndex + 1, pagination.nextCursor);
  }

  return {
    data: dataMapper(response.data),
    pagination,
    nextCursor: pagination.nextCursor,
  };
}

/**
 * Strategy for fetching a specific page from Zerion
 * Uses cached cursors when available to optimize requests
 */
export interface ZerionPaginationStrategy {
  /**
   * Fetches a specific page, using cached cursors when possible
   * @param fetchPage - Function to fetch a page with a cursor
   * @param targetPageIndex - The page index to fetch
   * @param pageSize - Page size
   * @returns The page result
   */
  fetchPage<TInput, TOutput>(
    fetchPage: (
      cursor?: string
    ) => Promise<ZerionPaginatedResponse & { data: TInput[] }>,
    targetPageIndex: number,
    pageSize: number,
    dataMapper: (data: TInput[]) => TOutput[]
  ): Promise<ZerionPageResult<TOutput>>;
}

/**
 * Default pagination strategy that uses cursor cache
 */
export class DefaultZerionPaginationStrategy implements ZerionPaginationStrategy {
  async fetchPage<TInput, TOutput>(
    fetchPage: (
      cursor?: string
    ) => Promise<ZerionPaginatedResponse & { data: TInput[] }>,
    targetPageIndex: number,
    pageSize: number,
    dataMapper: (data: TInput[]) => TOutput[]
  ): Promise<ZerionPageResult<TOutput>> {
    // Check if we have a cached cursor for this exact page
    const exactCursor = cursorCache.get(targetPageIndex);
    if (exactCursor) {
      const response = await fetchPage(exactCursor);
      return processZerionPage(response, targetPageIndex, pageSize, dataMapper);
    }

    // Check if we have a cached cursor for a previous page
    const closest = cursorCache.getClosestCursor(targetPageIndex);
    if (closest) {
      // Start from the closest cached page
      let currentCursor = closest.cursor;
      let currentPageIndex = closest.startPageIndex;

      // Fetch pages sequentially from the closest cached page
      while (currentPageIndex < targetPageIndex) {
        const response = await fetchPage(currentCursor);
        const pagination = calculatePaginationInfo(response, pageSize);

        if (!pagination.hasNext || !pagination.nextCursor) {
          // No more pages available
          return {
            data: [],
            pagination: {
              totalCount: pagination.totalCount,
              pageCount: pagination.pageCount,
              pageSize,
              hasNext: false,
              nextCursor: undefined,
            },
            nextCursor: undefined,
          };
        }

        currentCursor = pagination.nextCursor;
        currentPageIndex++;
      }

      // Fetch the target page
      const response = await fetchPage(currentCursor);
      return processZerionPage(response, targetPageIndex, pageSize, dataMapper);
    }

    // No cache available, fetch from the beginning
    let currentCursor: string | undefined = undefined;
    let currentPageIndex = 0;

    while (currentPageIndex < targetPageIndex) {
      const response = await fetchPage(currentCursor);
      const pagination = calculatePaginationInfo(response, pageSize);

      if (!pagination.hasNext || !pagination.nextCursor) {
        // No more pages available
        return {
          data: [],
          pagination: {
            totalCount: pagination.totalCount,
            pageCount: pagination.pageCount,
            pageSize,
            hasNext: false,
            nextCursor: undefined,
          },
          nextCursor: undefined,
        };
      }

      currentCursor = pagination.nextCursor;
      currentPageIndex++;
    }

    // Fetch the target page
    const response = await fetchPage(currentCursor);
    return processZerionPage(response, targetPageIndex, pageSize, dataMapper);
  }
}

/**
 * Default instance of the pagination strategy
 */
export const defaultPaginationStrategy = new DefaultZerionPaginationStrategy();
