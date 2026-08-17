import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { animalHealthStoreFeature } from './animal-health.store';
import { animalStoreFeature } from './animal.store';

/**
 * The composed store, built by dropping the two leaf FEATURES in side by side.
 * Because each leaf is a `signalStoreFeature` with non-colliding state keys,
 * composition is a one-liner — no manual injection, no re-plumbing. It adds no
 * state of its own beyond derived signals and a convenience `loadAll`.
 *
 * The leaf stores (`AnimalStore`, `AnimalHealthStore`) remain exported and
 * independently injectable — this composition does not replace them.
 */
export const AnimalWithHealthStore = signalStore(
  { providedIn: 'root' },
  animalStoreFeature(), // animals, loading, error, count, load()
  animalHealthStoreFeature(), // records, healthLoading, healthError, loadForAnimal(), loadDueToday()
  withComputed((store) => ({
    busy: computed(() => store.loading() || store.healthLoading()),
    anyError: computed(() => store.error() ?? store.healthError()),
  })),
  withMethods((store) => ({
    async loadAll(animalId: string): Promise<void> {
      await Promise.all([store.load(''), store.loadForAnimal(animalId)]);
    },
  })),
);
