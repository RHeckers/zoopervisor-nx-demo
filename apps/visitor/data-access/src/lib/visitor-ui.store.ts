import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';

/**
 * Cross-feature UI state for the visitor app. It is NOT a domain store — it
 * holds app-level view state (the current search term) that more than one
 * feature shares. Facades inject it; features never touch it directly.
 */
export const VisitorUiStore = signalStore(
  { providedIn: 'root' },
  withState<{ searchTerm: string }>({ searchTerm: '' }),
  withMethods((store) => ({
    setSearch(term: string): void {
      patchState(store, { searchTerm: term });
    },
  })),
);
