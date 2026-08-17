import { normalizeError } from './normalize-error';

/**
 * Call-site control, generalised. Any feature store's load method can take these
 * options so a call site overrides where data comes from (`source`), how it
 * merges into state (`updater`), and what happens after (`onSuccess`/`onError`)
 * — without the store hard-coding any of it. This is the standard shape;
 * `runLoad` below drives the pending/try/catch/callback flow once.
 */
export type LoadSource<TItem> = (query: string) => Promise<TItem[]>;

export type LoadUpdater<TItem, TState> = (
  items: TItem[],
  state: TState,
) => Partial<TState>;

export interface LoadOptions<TItem, TState> {
  query: string;
  source?: LoadSource<TItem>;
  updater?: LoadUpdater<TItem, TState>;
  onSuccess?: (items: TItem[]) => void;
  onError?: (error: unknown) => void;
}

/** Every store this drives carries a loading flag and an error slot. */
export interface RequestFields {
  loading: boolean;
  error: string | null;
}

// --- Default updaters --------------------------------------------------------
// Pick one for the store's default; a call site can pass any of these (or its
// own) as `options.updater`. All target a single list-shaped state key.

/** Replace the list with the result. */
export function overwriteWithResult<
  TItem,
  TState,
  K extends keyof TState,
>(key: K): LoadUpdater<TItem, TState> {
  return (items) => ({ [key]: items }) as Partial<TState>;
}

/** Append the result to the existing list. */
export function appendToList<TItem, TState, K extends keyof TState>(
  key: K,
): LoadUpdater<TItem, TState> {
  return (items, state) =>
    ({ [key]: [...(state[key] as TItem[]), ...items] }) as Partial<TState>;
}

/** Prepend the result to the existing list. */
export function prependToList<TItem, TState, K extends keyof TState>(
  key: K,
): LoadUpdater<TItem, TState> {
  return (items, state) =>
    ({ [key]: [...items, ...(state[key] as TItem[])] }) as Partial<TState>;
}

/**
 * Deep-merge-by-identity: upsert each result item into the list, shallow-merging
 * fields onto an existing entry with the same id, appending the rest. The
 * entity-list flavour of a deep merge.
 */
export function deepMergeById<
  TItem extends Record<string, unknown>,
  TState,
  K extends keyof TState,
>(key: K, idField: keyof TItem = 'id' as keyof TItem): LoadUpdater<TItem, TState> {
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
 * Standard load flow: set pending, run the (overridable) source, merge with the
 * (overridable) updater, fire callbacks, normalise errors. `patch`/`snapshot`
 * are the store's patchState/getState, passed in so this stays free of any
 * @ngrx/signals import.
 */
export async function runLoad<TItem, TState extends RequestFields>(
  patch: (partial: Partial<TState>) => void,
  snapshot: () => TState,
  options: LoadOptions<TItem, TState>,
  defaults: { source: LoadSource<TItem>; updater: LoadUpdater<TItem, TState> },
): Promise<void> {
  const source = options.source ?? defaults.source;
  const updater = options.updater ?? defaults.updater;

  patch({ loading: true, error: null } as Partial<TState>);
  try {
    const items = await source(options.query);
    patch({ ...updater(items, snapshot()), loading: false } as Partial<TState>);
    options.onSuccess?.(items);
  } catch (error) {
    patch({
      loading: false,
      error: normalizeError(error),
    } as Partial<TState>);
    options.onError?.(error);
  }
}
