import {
  patchState,
  signalStore,
  signalStoreFeature,
  withMethods,
  withState,
} from '@ngrx/signals';
import { FeedingSchedule } from '@zoo/feeding/types';

const SCHEDULES: readonly FeedingSchedule[] = [
  { id: 'f1', animalId: 'a1', at: '09:30', food: 'Meat' },
  { id: 'f2', animalId: 'a2', at: '11:00', food: 'Fish' },
  { id: 'f3', animalId: 'a3', at: '14:00', food: 'Seeds' },
];

/** The reusable feature. Domain-prefixed keys keep composition collision-free. */
export function feedingStoreFeature() {
  return signalStoreFeature(
    withState<{ schedules: FeedingSchedule[]; feedingLoading: boolean }>({
      schedules: [],
      feedingLoading: false,
    }),
    withMethods((store) => ({
      /** List schedules for one animal. */
      async loadForAnimal(animalId: string): Promise<void> {
        patchState(store, { feedingLoading: true });
        patchState(store, {
          schedules: SCHEDULES.filter((s) => s.animalId === animalId),
          feedingLoading: false,
        });
      },
      /** Add a schedule (create). */
      schedule(animalId: string, at: string, food: string): void {
        const created: FeedingSchedule = {
          id: `f${store.schedules().length + 1}`,
          animalId,
          at,
          food,
        };
        patchState(store, { schedules: [...store.schedules(), created] });
      },
    })),
  );
}

/** The full store — inject it directly when composition isn't needed. */
export const FeedingStore = signalStore(
  { providedIn: 'root' },
  feedingStoreFeature(),
);
