import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { zooTokens } from './tokens';

/** Dumb layout primitive: flex row/column with a token-sized gap. */
@Component({
  selector: 'zoo-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': '"flex"',
    '[style.flexDirection]': 'direction()',
    '[style.gap]': 'gap',
  },
  template: `<ng-content />`,
})
export class StackComponent {
  readonly direction = input<'row' | 'column'>('column');
  protected readonly gap = zooTokens.space(2);
}
