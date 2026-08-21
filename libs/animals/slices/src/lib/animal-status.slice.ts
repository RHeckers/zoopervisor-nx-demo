import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
} from '@angular/core';
import { AnimalHealthStore, AnimalStore } from '@zoo/animals/data-access';
import { AnimalCardComponent } from '@zoo/animals/ui';

/*
 * A smart, self-wiring block. Drop <zoo-animal-status-slice [animalId]="id" />
 * into any feature and it resolves everything itself — it injects TWO leaf
 * stores of its own domain (animals + health), triggers the loads, and
 * derives the animal plus its latest health check from the results.
 *
 * Rule: a slice may reach ui, data-access, util and types — nothing else.
 */
@Component({
  selector: 'zoo-animal-status-slice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimalCardComponent],
  templateUrl: './animal-status.slice.html',
  styleUrl: './animal-status.slice.css',
})
export class AnimalStatusSlice implements OnInit {
  readonly animalId = input.required<string>();

  private readonly store = inject(AnimalStore);
  private readonly health = inject(AnimalHealthStore);

  protected readonly animal = computed(() =>
    this.store.animals().find((a) => a.id === this.animalId()),
  );

  /** Most recent health record for this animal, if any is loaded. */
  protected readonly latestCheck = computed(() => {
    const mine = this.health
      .records()
      .filter((r) => r.animalId === this.animalId());
    return [...mine].sort((a, b) => b.checkedOn.localeCompare(a.checkedOn))[0];
  });

  ngOnInit(): void {
    void this.store.load('');
    void this.health.loadForAnimal(this.animalId());
  }
}
