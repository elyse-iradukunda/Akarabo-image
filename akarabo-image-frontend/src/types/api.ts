/** Shared transport-level shapes returned by the Akarabo Image API. */

/** Pagination block attached to every list endpoint. */
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

/** Envelope used by every list endpoint. */
export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

/** The single error shape the backend returns for every failure. */
export interface ApiErrorEnvelope {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}

/** Query parameters accepted by every list endpoint. */
export interface PageQuery {
  page?: number;
  limit?: number;
}

/** Normalised error surfaced to the UI layer. */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly errors: string[];
  readonly error: string;

  constructor(
    message: string,
    statusCode: number,
    errors: string[] = [],
    error = 'Unknown Error',
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    this.error = error;
  }

  /** True when the request was rejected because of missing/expired auth. */
  get isUnauthorized(): boolean {
    return this.statusCode === 401;
  }

  /** True when the caller is authenticated but lacks the required role. */
  get isForbidden(): boolean {
    return this.statusCode === 403;
  }
}
