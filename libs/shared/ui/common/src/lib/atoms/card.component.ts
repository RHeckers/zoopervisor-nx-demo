import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Dumb surface. All values are CSS custom properties: the fallback is the
 * global token (libs/shared/styles), the `--zoo-card-*` var is an override
 * hook any consumer can set on an ancestor — no inputs, no TS styling.
 */
@Component({
  selector: 'zoo-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: `
    :host {
      display: block;
      padding: var(--zoo-card-padding, var(--spacer-base));
      background: var(--zoo-card-background, var(--color-paper));
      border-radius: var(--zoo-card-radius, var(--radius-base));
    }
  `,
})
export class CardComponent {}
