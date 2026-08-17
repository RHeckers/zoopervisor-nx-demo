/** Cross-cutting id type. Every domain entity's `id` is one of these. */
export type Id = string;

/** A single page of results from any list endpoint. */
export interface Paginated<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}

/** Convenience constructor used by the fake in-memory data-access libs. */
export function pageOf<T>(items: readonly T[], page = 0, pageSize = 20): Paginated<T> {
  const start = page * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}
