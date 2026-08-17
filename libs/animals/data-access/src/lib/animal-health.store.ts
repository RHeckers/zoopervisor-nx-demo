import { inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withMethods,
  withState,
} from '@ngrx/signals';
import { AnimalHealthRecord } from '@zoo/animals/types';
import { normalizeError } from '@zoo/shared/data-access';
import { ANIMAL_API } from './animal.api';

export interface AnimalHealthState {
  records: AnimalHealthRecord[];
  loading: boolean;
  error: string | null;
}

const initialState: AnimalHealthState = {
  records: [],
  loading: false,
  error: null,
};

/**
 * One entity, one endpoint — same thin shape as `AnimalStore`. Loadable by
 * animal id *and* by "due today", so it is visibly not just a dependency of the
 * composed store: an app can inject it directly to build a rounds checklist.
 */
export const AnimalHealthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => {
    const api = inject(ANIMAL_API);

    async function run(load: () => Promise<AnimalHealthRecord[]>): Promise<void> {
      patchState(store, { loading: true, error: null });
      try {
        patchState(store, { records: await load(), loading: false });
      } catch (error) {
        patchState(store, { loading: false, error: normalizeError(error) });
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
