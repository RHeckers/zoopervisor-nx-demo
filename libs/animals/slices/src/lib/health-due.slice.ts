import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
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
  imports: [
    BadgeComponent,
    EmptyStateComponent,
    SpinnerComponent,
    StackComponent,
  ],
  templateUrl: './health-due.slice.html',
})
export class HealthDueSlice implements OnInit {
  protected readonly store = inject(AnimalHealthStore);

  ngOnInit(): void {
    void this.store.loadDueToday();
  }
}
