import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { AnimalStore } from '@zoo/animals/data-access';
import { AnimalCardComponent } from '@zoo/animals/ui';

/*
 * A smart, self-wiring block. Drop <zoo-animal-status-slice [animalId]="id" />
 * into any feature and it resolves everything itself — it injects the store,
 * triggers the load, and picks its animal out of the result.
 *
 * Rule: a slice may reach ui, data-access, util and types — nothing else.
 */
@Component({
  selector: 'zoo-animal-status-slice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimalCardComponent],
  template: `@if (animal(); as a) {
      <zoo-animal-card [animal]="a" />
    } @else {
      <span>Loading…</span>
    }`,
})
export class AnimalStatusSlice {
  readonly animalId = input.required<string>();

  private readonly store = inject(AnimalStore);
  protected readonly animal = computed(() =>
    this.store.animals().find((a) => a.id === this.animalId()),
  );

  constructor() {
    void this.store.load('');
  }
}
