import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EnclosureOccupancySlice } from '@zoo/enclosures/slices';
import { EnclosureBadgeComponent } from '@zoo/enclosures/ui';
import {
  CardComponent,
  EmptyStateComponent,
  StackComponent,
} from '@zoo/shared/ui/common';
import { VisitorSearchSlice } from '@zoo/visitor/slices';
import { EnclosureMapFacade } from './enclosure-map.facade';

/**
 * Thin smart component: injects only the facade; reuses the app search slice
 * AND drops in the enclosures domain slice — two flavours of slice on one page.
 */
@Component({
  selector: 'zoo-enclosure-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EnclosureMapFacade],
  imports: [
    CardComponent,
    EmptyStateComponent,
    EnclosureBadgeComponent,
    EnclosureOccupancySlice,
    StackComponent,
    VisitorSearchSlice,
  ],
  template: `<zoo-stack class="enclosure-map">
    <header class="enclosure-map__header">
      <h2>Enclosures</h2>
      <zoo-visitor-search-slice class="enclosure-map__search" />
    </header>

    <zoo-stack direction="row" class="enclosure-map__badges">
      @for (e of facade.vm().enclosures; track e.id) {
        <zoo-enclosure-badge [enclosure]="e" />
      } @empty {
        <zoo-empty-state message="No enclosures match your search" />
      }
    </zoo-stack>

    <zoo-card>
      <zoo-stack>
        <h3>Occupancy</h3>
        <!-- domain slice: self-wiring, injects its own store, zero props. -->
        <zoo-enclosure-occupancy-slice />
      </zoo-stack>
    </zoo-card>
  </zoo-stack>`,
  styles: `
    .enclosure-map {
      --zoo-stack-gap: var(--spacer-lg);
    }
    .enclosure-map__header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacer-base);
    }
    .enclosure-map__search {
      flex: 0 1 320px;
    }
    .enclosure-map__badges {
      flex-wrap: wrap;
    }
  `,
})
export class EnclosureMapComponent {
  protected readonly facade = inject(EnclosureMapFacade);

  constructor() {
    this.facade.refresh();
  }
}
