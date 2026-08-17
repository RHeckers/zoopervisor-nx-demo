import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnimalCardComponent } from '@zoo/animals/ui';
import { EnclosureBadgeComponent } from '@zoo/enclosures/ui';
import { StackComponent } from '@zoo/shared/ui';
import { VisitorSearchSlice } from '@zoo/visitor/slices';
import { AnimalListFacade } from './animal-list.facade';

/**
 * Smart, but thin: it injects ONLY the facade — never a domain store directly.
 * It also drops in the app-level search slice (used again in enclosure-map).
 */
@Component({
  selector: 'zoo-animal-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AnimalListFacade],
  imports: [
    AnimalCardComponent,
    EnclosureBadgeComponent,
    StackComponent,
    VisitorSearchSlice,
  ],
  template: `<zoo-stack>
    <zoo-visitor-search-slice />
    @for (e of facade.vm().enclosures; track e.id) {
      <zoo-enclosure-badge [enclosure]="e" />
    }
    @for (a of facade.vm().animals; track a.id) {
      <zoo-animal-card [animal]="a" />
    }
  </zoo-stack>`,
})
export class AnimalListComponent {
  protected readonly facade = inject(AnimalListFacade);

  constructor() {
    this.facade.refresh();
  }
}
