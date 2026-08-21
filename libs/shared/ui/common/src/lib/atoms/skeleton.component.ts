import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Dumb loading placeholder. `shape` is a semantic variant mapped to a
 * data-attribute; every size resolves in CSS from the `--zoo-skeleton-*`
 * consumer override hooks. Decorative only, so it is hidden from readers.
 */
@Component({
  selector: 'zoo-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-shape]': 'shape()', 'aria-hidden': 'true' },
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css',
})
export class SkeletonComponent {
  readonly shape = input<'line' | 'circle'>('line');
}
