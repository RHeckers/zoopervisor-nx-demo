import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Dumb busy indicator. */
@Component({
  selector: 'zoo-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status', '[attr.aria-label]': 'label()' },
  template: `<span class="zoo-spinner" aria-hidden="true">◔</span> {{ label() }}`,
  styles: `
    :host {
      color: var(--zoo-spinner-color, var(--color-muted));
    }
    .zoo-spinner {
      display: inline-block;
      animation: zoo-spin 1s linear infinite;
    }
    @keyframes zoo-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class SpinnerComponent {
  readonly label = input('Loading…');
}
