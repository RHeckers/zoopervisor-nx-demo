import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb keeper-mobile-ui component — signal inputs only, no store, no HTTP. */
@Component({
  selector: 'zoo-keeper-mobile-ui',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="zoo-keeper-mobile-ui">{{ label() }}</span>`,
})
export class KeeperMobileUiComponent {
  readonly label = input('');
}
