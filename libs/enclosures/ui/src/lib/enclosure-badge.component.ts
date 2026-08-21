import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Enclosure } from '@zoo/enclosures/types';

/** Dumb badge. Signal input only. */
@Component({
  selector: 'zoo-enclosure-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './enclosure-badge.component.html',
  styleUrl: './enclosure-badge.component.css',
})
export class EnclosureBadgeComponent {
  readonly enclosure = input.required<Enclosure>();
}
