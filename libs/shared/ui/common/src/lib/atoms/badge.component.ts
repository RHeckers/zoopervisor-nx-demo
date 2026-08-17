import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { zooTokens } from './tokens';

/** Dumb status pill. Tone maps onto a design token. */
@Component({
  selector: 'zoo-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': '"inline-block"',
    '[style.background]': 'background()',
    '[style.color]': '"white"',
    '[style.padding]': 'padding',
    '[style.borderRadius]': 'radius',
    '[style.fontSize]': '"0.75rem"',
  },
  template: `<ng-content />`,
})
export class BadgeComponent {
  readonly tone = input<'leaf' | 'aquarium' | 'savanna' | 'ink'>('ink');
  protected readonly background = computed(() => zooTokens.color[this.tone()]);
  protected readonly padding = `${zooTokens.space(1)} ${zooTokens.space(2)}`;
  protected readonly radius = zooTokens.radius;
}
