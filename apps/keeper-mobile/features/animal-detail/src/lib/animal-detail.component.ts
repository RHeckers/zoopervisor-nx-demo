import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnimalCardComponent } from '@zoo/animals/ui';
import {
  BottomSheetComponent,
  TouchButtonComponent,
} from '@zoo/shared/ui/mobile';
import { AnimalDetailFacade } from './animal-detail.facade';

/**
 * Thin smart component. Injects only the facade and uses the mobile-only UI
 * controls (touch button + bottom sheet) — this app is platform:mobile.
 */
@Component({
  selector: 'zoo-animal-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AnimalDetailFacade],
  imports: [AnimalCardComponent, TouchButtonComponent, BottomSheetComponent],
  template: `@for (a of facade.vm().animals; track a.id) {
      <zoo-animal-card [animal]="a" />
    }
    <zoo-bottom-sheet>
      <zoo-touch-button (tapped)="facade.open('a1')">Reload rounds</zoo-touch-button>
      <p>{{ facade.vm().schedules.length }} feeding(s), {{ facade.vm().records.length }} record(s)</p>
    </zoo-bottom-sheet>`,
})
export class AnimalDetailComponent {
  protected readonly facade = inject(AnimalDetailFacade);

  constructor() {
    this.facade.open('a1');
  }
}
