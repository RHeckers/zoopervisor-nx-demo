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
import { Animal, AnimalPage } from '@zoo/animals/types';
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
  /** Total matches server-side — `animals` holds the pages loaded so far. */
  total: number;
  page: number;
  selected: Animal | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnimalState = {
  animals: [],
  total: 0,
  page: 1,
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
        /** List page 1. Default updater: overwrite `animals` with the page. */
        load(query: string, options?: Options<AnimalPage>): Promise<void> {
          return runOperation(
            patch,
            snapshot,
            {
              source: () => api.listAnimals(query, 1),
              updater: (result) => ({
                animals: result.items,
                total: result.total,
                page: result.page,
              }),
            },
            options,
          );
        },

        /** Next page. Default updater: APPEND the page to `animals`. */
        loadMore(query: string, options?: Options<AnimalPage>): Promise<void> {
          return runOperation(
            patch,
            snapshot,
            {
              source: () => api.listAnimals(query, snapshot().page + 1),
              updater: (result, state) => ({
                animals: [...state.animals, ...result.items],
                total: result.total,
                page: result.page,
              }),
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
