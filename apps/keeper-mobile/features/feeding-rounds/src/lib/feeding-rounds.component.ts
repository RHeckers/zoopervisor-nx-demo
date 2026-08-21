import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { AnimalStatusSlice, HealthDueSlice } from '@zoo/animals/slices';
import { FeedingStore } from '@zoo/feeding/data-access';
import { CardComponent, StackComponent } from '@zoo/shared/ui/common';
import {
  ActionSheetComponent,
  SheetActionComponent,
} from '@zoo/shared/ui/mobile';

/*
 * Smart routed page WITHOUT a facade — one domain store and a single local
 * signal don't earn one (compare animal-detail, which composes two stores
 * behind its facade). The health checklist needs no plumbing either: it is
 * the self-wiring <zoo-health-due-slice> from libs/animals/slices.
 */
@Component({
  selector: 'zoo-feeding-rounds',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AnimalStatusSlice,
    HealthDueSlice,
    CardComponent,
    StackComponent,
    ActionSheetComponent,
    SheetActionComponent,
  ],
  templateUrl: './feeding-rounds.component.html',
})
export class FeedingRoundsComponent implements OnInit {
  protected readonly feeding = inject(FeedingStore);

  protected readonly animalId = signal('a1');

  ngOnInit(): void {
    this.open('a1');
  }

  protected open(animalId: string): void {
    this.animalId.set(animalId);
    void this.feeding.loadForAnimal(animalId);
  }

  protected logFeeding(): void {
    this.feeding.schedule(this.animalId(), '16:00', 'Treats');
  }
}
