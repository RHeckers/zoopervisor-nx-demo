import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * A sheet that slides up from the bottom edge — a mobile navigation pattern.
 * It respects the device safe-area inset (notch / home indicator), a concern
 * that only exists on mobile. All values are CSS custom properties: global
 * tokens as defaults, `--zoo-bottom-sheet-*` as consumer override hooks.
 * `platform:mobile`.
 */
@Component({
  selector: 'zoo-bottom-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  styles: `
    :host {
      position: fixed;
      inset-inline: 0;
      bottom: 0;
      z-index: var(--zoo-bottom-sheet-z-index, var(--z-modal));
      /* env() is a mobile-only capability; the spacer token is the fallback. */
      padding-bottom: var(
        --zoo-bottom-sheet-safe-area,
        env(safe-area-inset-bottom, var(--spacer-sm))
      );
      border-start-start-radius: var(--zoo-bottom-sheet-radius, var(--radius-sheet));
      border-start-end-radius: var(--zoo-bottom-sheet-radius, var(--radius-sheet));
    }
  `,
})
export class BottomSheetComponent {}
