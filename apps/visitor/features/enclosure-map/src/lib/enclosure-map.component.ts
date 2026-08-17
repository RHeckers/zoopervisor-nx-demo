import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EnclosureBadgeComponent } from '@zoo/enclosures/ui';
import { StackComponent } from '@zoo/shared/ui';
import { VisitorSearchSlice } from '@zoo/visitor/slices';
import { EnclosureMapFacade } from './enclosure-map.facade';

/** Thin smart component: injects only the facade; reuses the app search slice. */
@Component({
  selector: 'zoo-enclosure-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EnclosureMapFacade],
  imports: [EnclosureBadgeComponent, StackComponent, VisitorSearchSlice],
  template: `<zoo-stack direction="row">
    <zoo-visitor-search-slice />
    @for (e of facade.vm().enclosures; track e.id) {
      <zoo-enclosure-badge [enclosure]="e" />
    }
  </zoo-stack>`,
})
export class EnclosureMapComponent {
  protected readonly facade = inject(EnclosureMapFacade);

  constructor() {
    this.facade.refresh();
  }
}
