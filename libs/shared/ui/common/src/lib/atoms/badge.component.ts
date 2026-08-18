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
  template: `<ng-content />`,
  styles: `
    :host {
      display: inline-block;
      align-self: start;
      width: fit-content;
      padding: var(--zoo-badge-padding, var(--spacer-xs) var(--spacer-sm));
      border-radius: var(--zoo-badge-radius, var(--radius-base));
      font-size: var(--zoo-badge-font-size, var(--font-size-caption));
      color: var(--zoo-badge-color, white);
      background: var(--zoo-badge-background, var(--color-ink));
    }
    :host([data-tone='leaf']) {
      background: var(--zoo-badge-background, var(--color-leaf));
    }
    :host([data-tone='aquarium']) {
      background: var(--zoo-badge-background, var(--color-aquarium));
    }
    :host([data-tone='savanna']) {
      background: var(--zoo-badge-background, var(--color-savanna));
    }
  `,
})
export class BadgeComponent {
  readonly tone = input<'leaf' | 'aquarium' | 'savanna' | 'ink'>('ink');
}
