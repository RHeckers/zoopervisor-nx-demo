import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Enclosure, Zone } from '@zoo/enclosures/types';

/** Which glyph stands for which zone is enclosures-domain knowledge. */
const ZONE_GLYPHS: Record<Zone, string> = {
  savanna: '🦁',
  aviary: '🦜',
  aquarium: '🐠',
  'reptile-house': '🦎',
};

/**
 * Dumb badge, but a DOMAIN one: it knows the zoo's zones — each zone gets its
 * glyph here and its palette in the stylesheet (via the data-zone attribute).
 * A generic shared badge could never own that mapping; that is exactly why
 * this component lives in libs/enclosures/ui.
 */
@Component({
  selector: 'zoo-enclosure-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-zone]': 'enclosure().zone' },
  templateUrl: './enclosure-badge.component.html',
  styleUrl: './enclosure-badge.component.css',
})
export class EnclosureBadgeComponent {
  readonly enclosure = input.required<Enclosure>();

  protected readonly glyph = computed(() => ZONE_GLYPHS[this.enclosure().zone]);
}
