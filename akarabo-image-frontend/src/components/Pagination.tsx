import { ChevronLeftIcon, ChevronRightIcon } from '../assets';
import { Button } from './Button';
import { PAGE_SIZE_OPTIONS } from '../data/constants';

export interface PaginationProps {
  /** Current page (1-based). */
  page: number;
  /** Rows per page. */
  limit: number;
  /** Total number of rows across all pages. */
  total: number;
  /** True when a previous page exists. */
  canGoPrevious: boolean;
  /** True when a next page exists. */
  canGoNext: boolean;
  /** Called with the new page number. */
  onPageChange: (page: number) => void;
  /** Called with the new page size. */
  onLimitChange: (limit: number) => void;
}

/** Page controls shown under every list table. */
export function Pagination({
  page,
  limit,
  total,
  canGoPrevious,
  canGoNext,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const firstRow = total === 0 ? 0 : (page - 1) * limit + 1;
  const lastRow = Math.min(page * limit, total);

  return (
    <div className="ak-pagination">
      <span>
        {total === 0
          ? 'No records'
          : `Showing ${firstRow}–${lastRow} of ${total}`}
      </span>

      <div className="ak-pagination__controls">
        <label className="ak-row ak-gap-2 ak-small">
          <span className="ak-muted">Rows</span>
          <select
            className="ak-select"
            style={{ height: 32, width: 74 }}
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>

        <Button
          variant="secondary"
          size="sm"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeftIcon size={16} />
        </Button>

        <span className="ak-pagination__page">
          {page} / {totalPages}
        </span>

        <Button
          variant="secondary"
          size="sm"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRightIcon size={16} />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
