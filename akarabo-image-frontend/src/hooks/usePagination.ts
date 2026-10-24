/**
 * Shared pagination helpers for every list screen.
 *
 * A screen keeps the `page` / `limit` state with `usePaginationState` (it
 * needs both to build the API query) and derives the controls with
 * `usePaginationControls` once the API `meta` block is known.
 */
import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '../data/constants';

export interface PaginationState {
  /** Current page (1-based). */
  page: number;
  /** Rows per page. */
  limit: number;
  /** Jump to a specific page. */
  setPage: (page: number) => void;
  /** Change the page size — resets to the first page. */
  setLimit: (limit: number) => void;
  /** Reset to the first page (used when filters change). */
  reset: () => void;
}

/** Owns the page / limit state of a list screen. */
export function usePaginationState(
  initialLimit: number = DEFAULT_PAGE_SIZE,
): PaginationState {
  const [page, setPageState] = useState(1);
  const [limit, setLimitState] = useState(initialLimit);

  const setPage = useCallback((next: number) => {
    setPageState(Math.max(1, Math.round(next)));
  }, []);

  const setLimit = useCallback((next: number) => {
    setLimitState(next);
    setPageState(1);
  }, []);

  const reset = useCallback(() => setPageState(1), []);

  return useMemo(
    () => ({ page, limit, setPage, setLimit, reset }),
    [page, limit, setPage, setLimit, reset],
  );
}

export interface PaginationControls {
  /** Total number of rows across all pages. */
  total: number;
  /** Total number of pages (at least 1). */
  totalPages: number;
  /** True when a previous page exists. */
  canGoPrevious: boolean;
  /** True when a next page exists. */
  canGoNext: boolean;
}

/** Derives the enabled/disabled state of the page controls. */
export function usePaginationControls({
  page,
  limit,
  total,
}: {
  page: number;
  limit: number;
  total: number;
}): PaginationControls {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return useMemo(
    () => ({
      total,
      totalPages,
      canGoPrevious: page > 1,
      canGoNext: page < totalPages,
    }),
    [page, total, totalPages],
  );
}
