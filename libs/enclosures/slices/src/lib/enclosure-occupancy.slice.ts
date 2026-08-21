import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { EnclosureStore } from '@zoo/enclosures/data-access';
import { EnclosureBadgeComponent } from '@zoo/enclosures/ui';
import { BadgeComponent, StackComponent } from '@zoo/shared/ui/common';

/*
 * Self-wiring occupancy overview for the enclosures domain. Injects the domain
 * store itself and loads on init — droppable into any feature of any app
 * (ticket-kiosk uses it in park-info; nothing was wired there).
 */
@Component({
  selector: 'zoo-enclosure-occupancy-slice',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EnclosureBadgeComponent, BadgeComponent, StackComponent],
  templateUrl: './enclosure-occupancy.slice.html',
})
export class EnclosureOccupancySlice implements OnInit {
  protected readonly store = inject(EnclosureStore);

  ngOnInit(): void {
    void this.store.loadEnclosures();
  }
}
