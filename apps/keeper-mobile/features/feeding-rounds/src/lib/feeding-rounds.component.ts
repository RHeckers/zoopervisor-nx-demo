import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AnimalStore } from '@zoo/animals/data-access';
import { AnimalStatusSlice, HealthDueSlice } from '@zoo/animals/slices';
import { FeedingStore } from '@zoo/feeding/data-access';
import { CardComponent, StackComponent } from '@zoo/shared/ui/common';
import {
  ActionSheetComponent,
  SheetActionComponent,
} from '@zoo/shared/ui/mobile';

/*
 * Smart routed page WITHOUT a facade — two stores read directly, one local
 * signal, no composition logic worth naming (compare animal-detail, which
 * earns its facade). The chips pick which animal the round is about; the
 * status block is the self-wiring animals-domain slice.
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
  styleUrl: './feeding-rounds.component.css',
})
export class FeedingRoundsComponent implements OnInit {
  protected readonly feeding = inject(FeedingStore);
  protected readonly animals = inject(AnimalStore);

  protected readonly animalId = signal('a1');
  protected readonly animalName = computed(
    () =>
      this.animals.animals().find((a) => a.id === this.animalId())?.name ??
      this.animalId(),
  );

  ngOnInit(): void {
    void this.animals.load('');
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
