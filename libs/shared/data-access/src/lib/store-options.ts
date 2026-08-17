import { normalizeError } from './normalize-error';

/**
 * Call-site control, generalised to EVERY store operation — not just list.
 * A create/update/remove/read-one call can each override where the data comes
 * from (`source`), how the result merges into state (`updater`), and what
 * happens after (`onSuccess`/`onError`). Every field is optional; the store
 * supplies a default `updater` suited to that operation (append for create,
 * replace for update, remove-by-id for delete, and so on).
 */
export interface OperationOptions<TResult, TState> {
  source?: () => Promise<TResult>;
  updater?: (result: TResult, state: TState) => Partial<TState>;
  onSuccess?: (result: TResult) => void;
  onError?: (error: unknown) => void;
}

/** Every store this drives carries a loading flag and an error slot. */
export interface RequestFields {
  loading: boolean;
  error: string | null;
}

// --- Default updaters, one per operation shape -------------------------------
// A call site can pass any of these (or its own) as `options.updater`.

/** Replace a state key with the whole result. list load → the list; read-one →
 *  the entity/undefined. */
export function setResult<TResult, TState, K extends keyof TState>(
  key: K,
): (result: TResult, state: TState) => Partial<TState> {
  return (result) => ({ [key]: result }) as Partial<TState>;
}
/** Alias kept for the list-load default. */
export const overwriteWithResult = setResult;

/** Append a single created item to a list. (create) */
export function appendItem<TItem, TState, K extends keyof TState>(
  key: K,
): (item: TItem, state: TState) => Partial<TState> {
  return (item, state) =>
    ({ [key]: [...(state[key] as TItem[]), item] }) as Partial<TState>;
}

/** Replace the list entry with the same id as the result. (update) */
export function replaceItem<TItem, TState, K extends keyof TState>(
  key: K,
  idField: keyof TItem = 'id' as keyof TItem,
): (item: TItem, state: TState) => Partial<TState> {
  return (item, state) =>
    ({
      [key]: (state[key] as TItem[]).map((e) =>
        e[idField] === item[idField] ? item : e,
      ),
    }) as Partial<TState>;
}

/** Drop the list entry with the given id; the result (often void) is ignored.
 *  The id is captured by the caller since a delete rarely echoes it back. */
export function removeItem<TResult, TItem, TState, K extends keyof TState>(
  key: K,
  id: unknown,
  idField: keyof TItem = 'id' as keyof TItem,
): (result: TResult, state: TState) => Partial<TState> {
  return (_result, state) =>
    ({
      [key]: (state[key] as TItem[]).filter((e) => e[idField] !== id),
    }) as Partial<TState>;
}

// --- Batch (array-result) updaters, for a source that returns many -----------

export function appendToList<TItem, TState, K extends keyof TState>(
  key: K,
): (items: TItem[], state: TState) => Partial<TState> {
  return (items, state) =>
    ({ [key]: [...(state[key] as TItem[]), ...items] }) as Partial<TState>;
}

export function prependToList<TItem, TState, K extends keyof TState>(
  key: K,
): (items: TItem[], state: TState) => Partial<TState> {
  return (items, state) =>
    ({ [key]: [...items, ...(state[key] as TItem[])] }) as Partial<TState>;
}

/** Deep-merge-by-identity: upsert each result item into the list. */
export function deepMergeById<TItem, TState, K extends keyof TState>(
  key: K,
  idField: keyof TItem = 'id' as keyof TItem,
): (items: TItem[], state: TState) => Partial<TState> {
  return (items, state) => {
    const next = [...(state[key] as TItem[])];
    for (const item of items) {
      const at = next.findIndex((e) => e[idField] === item[idField]);
      if (at >= 0) next[at] = { ...next[at], ...item };
      else next.push(item);
    }
    return { [key]: next } as Partial<TState>;
  };
}

// --- The one loop ------------------------------------------------------------

/**
 * Standard operation flow: set pending, run the (overridable) source, merge with
 * the (overridable) updater, fire callbacks, normalise errors. `patch`/`snapshot`
 * are the store's patchState/getState, passed in so this stays free of any
 * @ngrx/signals import. `defaults` are the operation-appropriate source+updater.
 */
export async function runOperation<TResult, TState extends RequestFields>(
  patch: (partial: Partial<TState>) => void,
  snapshot: () => TState,
  defaults: {
    source: () => Promise<TResult>;
    updater: (result: TResult, state: TState) => Partial<TState>;
  },
  options?: OperationOptions<TResult, TState>,
): Promise<void> {
  const source = options?.source ?? defaults.source;
  const updater = options?.updater ?? defaults.updater;

  patch({ loading: true, error: null } as Partial<TState>);
  try {
    const result = await source();
    patch({ ...updater(result, snapshot()), loading: false } as Partial<TState>);
    options?.onSuccess?.(result);
  } catch (error) {
    patch({
      loading: false,
      error: normalizeError(error),
    } as Partial<TState>);
    options?.onError?.(error);
  }
}
