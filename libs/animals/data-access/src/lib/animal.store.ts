import { computed, inject } from '@angular/core';
import {
  getState,
  patchState,
  signalStore,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Animal } from '@zoo/animals/types';
import {
  OperationOptions,
  appendItem,
  removeItem,
  replaceItem,
  runOperation,
  setResult,
} from '@zoo/shared/data-access';
import { ANIMAL_API } from './animal.api';

export interface AnimalState {
  animals: Animal[];
  selected: Animal | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnimalState = {
  animals: [],
  selected: null,
  loading: false,
  error: null,
};

// Every operation shares the same optional call-site control (source, updater,
// onSuccess, onError). The store-specific input (query / id / patch) stays a
// plain method argument — it is not part of the generic options.
type Options<TResult> = OperationOptions<TResult, AnimalState>;

/**
 * The reusable feature `AnimalStore` composes. A single-entity store still
 * fronts many requests for that entity — list, read one, create, update,
 * remove — and every one of them accepts the same optional options with a
 * default updater suited to the operation. It knows nothing about health.
 */
export function animalStoreFeature() {
  return signalStoreFeature(
    withState(initialState),
    withComputed(({ animals }) => ({
      count: computed(() => animals().length),
    })),
    withMethods((store) => {
      const api = inject(ANIMAL_API);
      const patch = (partial: Partial<AnimalState>) =>
        patchState(store, partial);
      const snapshot = () => getState(store);

      return {
        /** List. Default updater: overwrite `animals` with the result. */
        load(query: string, options?: Options<Animal[]>): Promise<void> {
          return runOperation(
            patch,
            snapshot,
            {
              source: () => api.listAnimals(query),
              updater: setResult('animals'),
            },
            options,
          );
        },

        /** Read one. Default updater: set `selected`. */
        loadOne(id: string, options?: Options<Animal | undefined>): Promise<void> {
          return runOperation(
            patch,
            snapshot,
            {
              source: () => api.getAnimal(id),
              updater: setResult('selected'),
            },
            options,
          );
        },

        /** Create. Default updater: append to `animals`. */
        create(input: Omit<Animal, 'id'>, options?: Options<Animal>): Promise<void> {
          return runOperation(
            patch,
            snapshot,
            {
              source: () => api.createAnimal(input),
              updater: appendItem('animals'),
            },
            options,
          );
        },

        /** Update. Default updater: replace the matching entry in `animals`. */
        update(
          id: string,
          changes: Partial<Omit<Animal, 'id'>>,
          options?: Options<Animal>,
        ): Promise<void> {
          return runOperation(
            patch,
            snapshot,
            {
              source: () => api.updateAnimal(id, changes),
              updater: replaceItem<Animal, AnimalState, 'animals'>('animals'),
            },
            options,
          );
        },

        /** Delete. Default updater: drop the id from `animals`. */
        remove(id: string, options?: Options<void>): Promise<void> {
          return runOperation(
            patch,
            snapshot,
            {
              source: () => api.deleteAnimal(id),
              updater: removeItem<void, Animal, AnimalState, 'animals'>(
                'animals',
                id,
              ),
            },
            options,
          );
        },
      };
    }),
  );
}

export const AnimalStore = signalStore(
  { providedIn: 'root' },
  animalStoreFeature(),
);
