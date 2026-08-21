import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Dumb status pill. `tone` is a semantic variant (not a style value); it maps
 * to a data-attribute and the colours resolve in CSS from the global tokens.
 * `--zoo-badge-*` vars are the consumer override hooks.
 */
@Component({
  selector: 'zoo-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-tone]': 'tone()' },
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css',
})
export class BadgeComponent {
  readonly tone = input<'leaf' | 'aquarium' | 'savanna' | 'ink'>('ink');
}
