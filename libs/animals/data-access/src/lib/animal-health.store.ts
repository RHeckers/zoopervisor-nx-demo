import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AnimalHealthRecord } from '@zoo/animals/types';
import { normalizeError } from '@zoo/shared/data-access';
import { ANIMAL_API } from './animal.api';

export interface AnimalHealthState {
  records: AnimalHealthRecord[];
  healthLoading: boolean;
  healthError: string | null;
}

const initialState: AnimalHealthState = {
  records: [],
  healthLoading: false,
  healthError: null,
};

/**
 * The reusable feature. Same thin shape as the animal store: one entity, one
 * endpoint — loadable by animal id *and* by "due today". State keys are
 * prefixed (`health*`) so it composes cleanly alongside other feature stores.
 */
export function animalHealthStoreFeature() {
  return signalStoreFeature(
    withState(initialState),
    withMethods((store) => {
      const api = inject(ANIMAL_API);

      async function run(
        load: () => Promise<AnimalHealthRecord[]>,
      ): Promise<void> {
        patchState(store, { healthLoading: true, healthError: null });
        try {
          patchState(store, { records: await load(), healthLoading: false });
        } catch (error) {
          patchState(store, {
            healthLoading: false,
            healthError: normalizeError(error),
          });
        }
      }

      return {
        loadForAnimal(animalId: string): Promise<void> {
          return run(() => api.healthForAnimal(animalId));
        },
        loadDueToday(): Promise<void> {
          return run(() => api.healthDueToday());
        },
      };
    }),
  );
}

/** The full store — inject it directly (e.g. a keeper's "due today" checklist). */
export const AnimalHealthStore = signalStore(
  { providedIn: 'root' },
  animalHealthStoreFeature(),
);
