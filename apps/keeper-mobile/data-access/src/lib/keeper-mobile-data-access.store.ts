import { signalStore, withState } from '@ngrx/signals';

/** Thin single-entity store for the keeper-mobile-data-access domain. */
export const KeeperMobileDataAccessStore = signalStore(
  { providedIn: 'root' },
  withState<{ loaded: boolean }>({ loaded: false }),
);
