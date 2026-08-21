import { Injectable, computed, inject, signal } from '@angular/core';
import {
  AnimalHealthStore,
  AnimalWithHealthStore,
} from '@zoo/animals/data-access';
import { HealthStatus } from '@zoo/animals/types';
import { FeedingStore } from '@zoo/feeding/data-access';

/**
 * Composes the animals COMPOSED store (animal + health in one) with the feeding
 * domain. The feature component talks only to this facade.
 */
@Injectable()
export class AnimalDetailFacade {
  private readonly animalHealth = inject(AnimalWithHealthStore);
  // The LEAF health store too: the page's slices read it, so writes go through
  // it (one API call), then the composed store re-reads to converge.
  private readonly healthLeaf = inject(AnimalHealthStore);
  private readonly feeding = inject(FeedingStore);

  private readonly selectedId = signal<string | null>(null);

  readonly vm = computed(() => ({
    animals: this.animalHealth.animals(),
    // Newest first — the list leads with it and healthFor picks it as the dot.
    records: [...this.animalHealth.records()].sort((a, b) =>
      b.checkedOn.localeCompare(a.checkedOn),
    ),
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

  /** WRITE intent: file a check for the selected animal — the record grows. */
  async logCheck(status: HealthStatus): Promise<void> {
    const id = this.selectedId();
    if (!id) return;
    // Leaf write updates the slices (status dot, due checklist) in place…
    await this.healthLeaf.logCheck(id, status);
    // …then the composed store re-reads so this page's own vm converges.
    await this.animalHealth.loadAll(id);
  }
}
