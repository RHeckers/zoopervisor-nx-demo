import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AnimalAvatarComponent } from '@zoo/animals/ui';
import { EnclosureBadgeComponent } from '@zoo/enclosures/ui';
import {
  CardComponent,
  EmptyStateComponent,
  SpinnerComponent,
  StackComponent,
} from '@zoo/shared/ui/common';
import { VisitorSearchSlice } from '@zoo/visitor/slices';
import { EnclosureMapFacade } from './enclosure-map.facade';

/**
 * Thin smart component: injects only the facade; reuses the app search slice.
 * Each enclosure card lists its residents (composed from the animals domain)
 * with a capacity meter; +N more expands the full list in place.
 */
@Component({
  selector: 'zoo-enclosure-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EnclosureMapFacade],
  imports: [
    AnimalAvatarComponent,
    CardComponent,
    EmptyStateComponent,
    EnclosureBadgeComponent,
    SpinnerComponent,
    StackComponent,
    VisitorSearchSlice,
  ],
  templateUrl: './enclosure-map.component.html',
  styleUrl: './enclosure-map.component.css',
})
export class EnclosureMapComponent {
  protected readonly facade = inject(EnclosureMapFacade);

  constructor() {
    this.facade.refresh();
  }
}
