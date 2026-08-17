import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb busy indicator. */
@Component({
  selector: 'zoo-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', '[attr.aria-label]': 'label()' },
  template: `<span class="zoo-spinner" aria-hidden="true">◔</span> {{ label() }}`,
})
export class SpinnerComponent {
  readonly label = input('Loading…');
}
