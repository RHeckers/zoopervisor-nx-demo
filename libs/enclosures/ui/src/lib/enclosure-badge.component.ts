import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Enclosure } from '@zoo/enclosures/types';

/** Dumb badge. Signal input only. */
@Component({
  selector: 'zoo-enclosure-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="zoo-enclosure-badge"
    >{{ enclosure().name }} · {{ enclosure().zone }}</span
  >`,
  styles: `
    .zoo-enclosure-badge {
      display: inline-block;
      padding: var(--zoo-enclosure-badge-padding, var(--spacer-xs) var(--spacer-sm));
      border: 1px solid var(--zoo-enclosure-badge-border, var(--color-aquarium));
      border-radius: var(--zoo-enclosure-badge-radius, var(--radius-base));
      color: var(--zoo-enclosure-badge-color, var(--color-aquarium));
      background: var(--zoo-enclosure-badge-background, transparent);
      font-size: var(--font-size-caption);
    }
  `,
})
export class EnclosureBadgeComponent {
  readonly enclosure = input.required<Enclosure>();
}
