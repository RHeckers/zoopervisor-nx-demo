import { ChangeDetectionStrategy, Component } from '@angular/core';
import { zooTokens } from './tokens';

/** Dumb surface. Uses design tokens for styling, nothing more. */
@Component({
  selector: 'zoo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': '"block"',
    '[style.padding]': 'padding',
    '[style.background]': 'background',
    '[style.borderRadius]': 'radius',
  },
  template: `<ng-content />`,
})
export class CardComponent {
  protected readonly padding = zooTokens.space(4);
  protected readonly background = zooTokens.color.paper;
  protected readonly radius = zooTokens.radius;
}
