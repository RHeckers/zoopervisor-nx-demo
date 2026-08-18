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
  template: `<zoo-card>
    <zoo-stack>
      <h3>Today in the park</h3>
      <zoo-enclosure-occupancy-slice />
      <small>Open 09:00 – 18:00 · last entry 17:00</small>
    </zoo-stack>
  </zoo-card>`,
})
export class ParkInfoComponent {}
