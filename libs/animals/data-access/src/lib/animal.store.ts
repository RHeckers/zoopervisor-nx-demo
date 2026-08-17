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
import { normalizeError } from '@zoo/shared/data-access';
import { ANIMAL_API } from './animal.api';

export interface AnimalState {
  animals: Animal[];
  loading: boolean;
  error: string | null;
}

const initialState: AnimalState = { animals: [], loading: false, error: null };

// --- Call-site control (this is a slide) -------------------------------------
// Every knob of `load` can be overridden per call: where the data comes from,
// how it merges into state, and what happens on success/failure.
export type AnimalSource = (query: string) => Promise<Animal[]>;
export type AnimalUpdater = (
  animals: Animal[],
  state: AnimalState,
) => Partial<AnimalState>;

export interface LoadInput {
  query: string;
  source?: AnimalSource;
  updater?: AnimalUpdater;
  onSuccess?: (animals: Animal[]) => void;
  onError?: (error: unknown) => void;
}

/**
 * The reusable feature `animalStore` composes. One entity, one loading flag,
 * one error. It knows nothing about health records — that lives in its own
 * store and the two are only joined by the composed store.
 */
export function animalStoreFeature() {
  return signalStoreFeature(
    withState(initialState),
    withComputed(({ animals }) => ({
      count: computed(() => animals().length),
    })),
    withMethods((store) => {
      const api = inject(ANIMAL_API);
      return {
        async load(input: LoadInput): Promise<void> {
          const source = input.source ?? ((query) => api.listAnimals(query));
          const updater = input.updater ?? ((animals) => ({ animals }));

          patchState(store, { loading: true, error: null });
          try {
            const animals = await source(input.query);
            patchState(store, {
              ...updater(animals, getState(store)),
              loading: false,
            });
            input.onSuccess?.(animals);
          } catch (error) {
            patchState(store, { loading: false, error: normalizeError(error) });
            input.onError?.(error);
          }
        },
      };
    }),
  );
}

export const AnimalStore = signalStore(
  { providedIn: 'root' },
  animalStoreFeature(),
);
