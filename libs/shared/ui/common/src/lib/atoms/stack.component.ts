import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Dumb layout primitive. `direction` is a semantic layout variant resolved in
 * CSS via a data-attribute; the gap comes from the global spacing token with
 * `--zoo-stack-gap` as the consumer override hook.
 */
@Component({
  selector: 'zoo-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-direction]': 'direction()' },
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.css',
})
export class StackComponent {
  readonly direction = input<'row' | 'column'>('column');
}
