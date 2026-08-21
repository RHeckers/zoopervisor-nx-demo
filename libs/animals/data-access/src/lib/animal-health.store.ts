import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AnimalHealthRecord, HealthStatus } from '@zoo/animals/types';
import { normalizeError } from '@zoo/shared/data-access';
import { ANIMAL_API } from './animal.api';

export interface AnimalHealthState {
  /** Records of the animal loaded via `loadForAnimal`. */
  records: AnimalHealthRecord[];
  /** Today's due checks, loaded via `loadDueToday` — separate state on
   *  purpose: two consumers on one page (a status block and a due checklist)
   *  must not clobber each other's result. */
  dueRecords: AnimalHealthRecord[];
  healthLoading: boolean;
  healthError: string | null;
}

const initialState: AnimalHealthState = {
  records: [],
  dueRecords: [],
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
        key: 'records' | 'dueRecords',
        load: () => Promise<AnimalHealthRecord[]>,
      ): Promise<void> {
        patchState(store, { healthLoading: true, healthError: null });
        try {
          patchState(store, { [key]: await load(), healthLoading: false });
        } catch (error) {
          patchState(store, {
            healthLoading: false,
            healthError: normalizeError(error),
          });
        }
      }

      return {
        loadForAnimal(animalId: string): Promise<void> {
          return run('records', () => api.healthForAnimal(animalId));
        },
        loadDueToday(): Promise<void> {
          return run('dueRecords', () => api.healthDueToday());
        },
        /** The write path: file a check, append it, and settle the due list. */
        async logCheck(animalId: string, status: HealthStatus): Promise<void> {
          patchState(store, { healthLoading: true, healthError: null });
          try {
            const record = await api.addHealthRecord(animalId, status);
            patchState(store, (state) => ({
              records: [...state.records, record],
              dueRecords: state.dueRecords.filter(
                (r) => r.animalId !== animalId,
              ),
              healthLoading: false,
            }));
          } catch (error) {
            patchState(store, {
              healthLoading: false,
              healthError: normalizeError(error),
            });
          }
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
