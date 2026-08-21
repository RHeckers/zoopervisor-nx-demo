import { computed } from '@angular/core';
import { signalStore, withComputed, withMethods } from '@ngrx/signals';
import { animalStoreFeature } from '@zoo/animals/data-access';
import { enclosureStoreFeature } from '@zoo/enclosures/data-access';

/*
 * APP-LEVEL composed store. The animals and enclosures domains each export
 * their store as a reusable FEATURE with domain-prefixed keys, so this app can
 * drop the two side by side into one store — no manual injection, no
 * re-plumbing (compare AnimalWithHealthStore, the same trick inside one
 * domain).
 *
 * Both visitor enclosure pages (map and detail) inject THIS store, so they
 * share one cache: animals loaded on the map are already there when the
 * detail page opens. The pages also get `openEnclosure`, a page-shaped method
 * that combines two domain calls that always run together here.
 */
export const VisitorParkStore = signalStore(
  { providedIn: 'root' },
  animalStoreFeature(), // animals, total, loading, load(), loadMore(), …
  enclosureStoreFeature(), // enclosures, selectedEnclosure, loadEnclosures(), …
  withComputed((store) => ({
    parkLoading: computed(() => store.loading() || store.enclosuresLoading()),
  })),
  withMethods((store) => ({
    /**
     * Everything the enclosure-detail page needs in ONE call: the enclosure
     * itself, plus the animals list its residents are filtered from — loaded
     * only if nothing is cached yet.
     */
    async openEnclosure(id: string): Promise<void> {
      const jobs = [store.loadOneEnclosure(id)];
      if (store.animals().length === 0) {
        jobs.push(store.load(''));
      }
      await Promise.all(jobs);
    },
  })),
);
