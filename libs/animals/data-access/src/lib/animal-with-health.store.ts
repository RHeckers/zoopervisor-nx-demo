import { computed, inject } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { AnimalHealthStore } from './animal-health.store';
import { AnimalStore } from './animal.store';

/**
 * The composed store. It injects the two root stores and exposes a combined
 * view plus a `load(id)` that triggers both. It adds NO state of its own beyond
 * derived signals — and crucially, `AnimalStore` and `AnimalHealthStore` remain
 * exported and independently injectable. That is the whole point of the example.
 */
export const AnimalWithHealthStore = signalStore(
  { providedIn: 'root' },
  withComputed(() => {
    const animals = inject(AnimalStore);
    const health = inject(AnimalHealthStore);
    return {
      animals: computed(() => animals.animals()),
      records: computed(() => health.records()),
      loading: computed(() => animals.loading() || health.loading()),
      error: computed(() => animals.error() ?? health.error()),
    };
  }),
  withMethods(() => {
    const animals = inject(AnimalStore);
    const health = inject(AnimalHealthStore);
    return {
      async load(animalId: string): Promise<void> {
        await Promise.all([
          animals.load({ query: '' }),
          health.loadForAnimal(animalId),
        ]);
      },
    };
  }),
);
