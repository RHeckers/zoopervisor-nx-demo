import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnimalHealthStore } from '@zoo/animals/data-access';
import {
  BadgeComponent,
  EmptyStateComponent,
  SpinnerComponent,
  StackComponent,
} from '@zoo/shared/ui/common';

/*
 * A second self-wiring slice for the animals domain. It injects the LEAF
 * AnimalHealthStore directly and uses its "due today" request — visibly NOT
 * just a dependency of the composed store. Drop it into any feature with no
 * wiring; same rule as every slice: ui, data-access, util, types — nothing else.
 */
@Component({
  selector: 'zoo-health-due-slice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent, EmptyStateComponent, SpinnerComponent, StackComponent],
  template: `<zoo-stack>
    <h4>Health checks due today</h4>
    @if (store.healthLoading()) {
      <zoo-spinner />
    } @else {
      @for (r of store.records(); track r.id) {
        <zoo-badge [tone]="r.status === 'treatment' ? 'savanna' : 'leaf'">
          {{ r.animalId }} · {{ r.status }}
        </zoo-badge>
      } @empty {
        <zoo-empty-state />
      }
    }
  </zoo-stack>`,
})
export class HealthDueSlice {
  protected readonly store = inject(AnimalHealthStore);

  constructor() {
    void this.store.loadDueToday();
  }
}
