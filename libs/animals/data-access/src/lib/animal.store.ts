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
 * The reusable feature `AnimalStore` composes. A single-entity store still
 * fronts many requests for that entity: list (with call-site control), read
 * one, create, update, remove. It knows nothing about health records.
 */
export function animalStoreFeature() {
  return signalStoreFeature(
    withState(initialState),
    withComputed(({ animals }) => ({
      count: computed(() => animals().length),
    })),
    withMethods((store) => {
      const api = inject(ANIMAL_API);

      async function guard(work: () => Promise<void>): Promise<void> {
        patchState(store, { loading: true, error: null });
        try {
          await work();
          patchState(store, { loading: false });
        } catch (error) {
          patchState(store, { loading: false, error: normalizeError(error) });
        }
      }

      return {
        /** List, with fully overridable source/updater/callbacks. */
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

        /** Read one into `selected`. */
        loadOne(id: string): Promise<void> {
          return guard(async () => {
            patchState(store, { selected: (await api.getAnimal(id)) ?? null });
          });
        },

        /** Create, then append to the list. */
        create(input: Omit<Animal, 'id'>): Promise<void> {
          return guard(async () => {
            const created = await api.createAnimal(input);
            patchState(store, { animals: [...store.animals(), created] });
          });
        },

        /** Update, then replace in the list. */
        update(id: string, patch: Partial<Omit<Animal, 'id'>>): Promise<void> {
          return guard(async () => {
            const updated = await api.updateAnimal(id, patch);
            patchState(store, {
              animals: store.animals().map((a) => (a.id === id ? updated : a)),
            });
          });
        },

        /** Delete, then drop from the list. */
        remove(id: string): Promise<void> {
          return guard(async () => {
            await api.deleteAnimal(id);
            patchState(store, {
              animals: store.animals().filter((a) => a.id !== id),
            });
          });
        },
      };
    }),
  );
}

export const AnimalStore = signalStore(
  { providedIn: 'root' },
  animalStoreFeature(),
);
