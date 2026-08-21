import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HealthDueSlice } from '@zoo/animals/slices';
import { CardComponent, StackComponent } from '@zoo/shared/ui/common';
import {
  ActionSheetComponent,
  SheetActionComponent,
} from '@zoo/shared/ui/mobile';
import { FeedingRoundsFacade } from './feeding-rounds.facade';

/**
 * Thin smart component: the feeding list goes through the facade; the health
 * checklist is the self-wiring domain slice, dropped in with zero wiring.
 */
@Component({
  selector: 'zoo-feeding-rounds',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FeedingRoundsFacade],
  imports: [
    HealthDueSlice,
    CardComponent,
    StackComponent,
    ActionSheetComponent,
    SheetActionComponent,
  ],
  templateUrl: './feeding-rounds.component.html',
})
export class FeedingRoundsComponent {
  protected readonly facade = inject(FeedingRoundsFacade);

  constructor() {
    this.facade.open('a1');
  }
}
