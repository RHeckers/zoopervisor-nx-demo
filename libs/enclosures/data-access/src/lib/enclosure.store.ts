import {
  patchState,
  signalStore,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Enclosure } from '@zoo/enclosures/types';

const DATA: readonly Enclosure[] = [
  { id: 'savanna', name: 'Savanna', zone: 'savanna', capacity: 12 },
  { id: 'aquarium', name: 'Aquarium', zone: 'aquarium', capacity: 40 },
  { id: 'aviary', name: 'Aviary', zone: 'aviary', capacity: 25 },
];

/** The reusable feature. State keys are domain-prefixed so it composes cleanly
 *  next to other feature stores (e.g. in a feature facade). */
export function enclosureStoreFeature() {
  return signalStoreFeature(
    withState<{
      enclosures: Enclosure[];
      selectedEnclosure: Enclosure | null;
      enclosuresLoading: boolean;
    }>({
      enclosures: [],
      selectedEnclosure: null,
      enclosuresLoading: false,
    }),
    withMethods((store) => ({
      /** List all enclosures. */
      async loadEnclosures(): Promise<void> {
        patchState(store, { enclosuresLoading: true });
        patchState(store, { enclosures: [...DATA], enclosuresLoading: false });
      },
      /** Read one by id into `selectedEnclosure`. */
      async loadOne(id: string): Promise<void> {
        patchState(store, {
          selectedEnclosure: DATA.find((e) => e.id === id) ?? null,
        });
      },
    })),
  );
}

/** The full store — inject it directly when composition isn't needed. */
export const EnclosureStore = signalStore(
  { providedIn: 'root' },
  enclosureStoreFeature(),
);
