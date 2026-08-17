import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Enclosure } from '@zoo/enclosures/types';

/** Dumb badge. Signal input only. */
@Component({
  selector: 'zoo-enclosure-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="zoo-enclosure-badge"
    >{{ enclosure().name }} · {{ enclosure().zone }}</span
  >`,
})
export class EnclosureBadgeComponent {
  readonly enclosure = input.required<Enclosure>();
}
