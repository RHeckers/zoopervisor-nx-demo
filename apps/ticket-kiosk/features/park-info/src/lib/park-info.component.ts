import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EnclosureOccupancySlice } from '@zoo/enclosures/slices';
import { CardComponent, StackComponent } from '@zoo/shared/ui/common';

/*
 * The degenerate feature: everything on screen is a self-wiring slice, so
 * there is nothing for a facade to compose — the generated facade was deleted
 * on purpose. The occupancy slice comes from the enclosures DOMAIN and was
 * written without any knowledge of this app; it wires itself.
 */
@Component({
  selector: 'zoo-park-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EnclosureOccupancySlice, CardComponent, StackComponent],
  templateUrl: './park-info.component.html',
})
export class ParkInfoComponent {}
