import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
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
    RouterLink,
    SpinnerComponent,
    StackComponent,
    VisitorSearchSlice,
  ],
  templateUrl: './enclosure-map.component.html',
  styleUrl: './enclosure-map.component.css',
})
export class EnclosureMapComponent implements OnInit {
  protected readonly facade = inject(EnclosureMapFacade);

  ngOnInit(): void {
    this.facade.refresh();
  }
}
