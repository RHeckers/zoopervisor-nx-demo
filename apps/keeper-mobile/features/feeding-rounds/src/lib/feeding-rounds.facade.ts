import { Injectable, computed, inject, signal } from '@angular/core';
import { FeedingStore } from '@zoo/feeding/data-access';

/**
 * Composes the feeding domain for the rounds screen. The health-due list on
 * the same screen needs NO facade plumbing at all — it is the self-wiring
 * <zoo-health-due-slice> from libs/animals/slices, dropped into the template.
 */
@Injectable()
export class FeedingRoundsFacade {
  private readonly feeding = inject(FeedingStore);

  private readonly animalId = signal('a1');

  readonly vm = computed(() => ({
    animalId: this.animalId(),
    schedules: this.feeding.schedules(),
    busy: this.feeding.feedingLoading(),
  }));

  open(animalId: string): void {
    this.animalId.set(animalId);
    void this.feeding.loadForAnimal(animalId);
  }

  logFeeding(): void {
    this.feeding.schedule(this.animalId(), '16:00', 'Treats');
  }
}
