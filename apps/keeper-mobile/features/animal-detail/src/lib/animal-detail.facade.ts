import { Injectable, computed, inject, signal } from '@angular/core';
import { AnimalWithHealthStore } from '@zoo/animals/data-access';
import { FeedingStore } from '@zoo/feeding/data-access';

/**
 * Composes the animals COMPOSED store (animal + health in one) with the feeding
 * domain. The feature component talks only to this facade.
 */
@Injectable()
export class AnimalDetailFacade {
  private readonly animalHealth = inject(AnimalWithHealthStore);
  private readonly feeding = inject(FeedingStore);

  private readonly selectedId = signal<string | null>(null);

  readonly vm = computed(() => ({
    animals: this.animalHealth.animals(),
    records: this.animalHealth.records(),
    schedules: this.feeding.schedules(),
    busy: this.animalHealth.busy() || this.feeding.feedingLoading(),
    selectedId: this.selectedId(),
    selected:
      this.animalHealth.animals().find((a) => a.id === this.selectedId()) ??
      null,
  }));

  open(animalId: string): void {
    this.selectedId.set(animalId);
    void this.animalHealth.loadAll(animalId);
    void this.feeding.loadForAnimal(animalId);
  }
}
