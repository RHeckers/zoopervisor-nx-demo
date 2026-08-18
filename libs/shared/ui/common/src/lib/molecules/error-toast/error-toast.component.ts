import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { translate } from '@jsverse/transloco';
import { SnackBar } from './snack-bar.service';

/**
 * AFTER: shared code names a key, not a sentence. The app decides the wording
 * via its translation file — ticket-kiosk overrides errors.generic to
 * "Please ask a member of staff." while inheriting errors.dismiss.
 */
@Component({
  selector: 'zoo-error-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (snackBar.current(); as toast) {
    <div class="zoo-error-toast">
      {{ toast.message }}
      <button type="button" (click)="snackBar.dismiss()">{{ toast.action }}</button>
    </div>
  }`,
  styles: `
    .zoo-error-toast {
      position: fixed;
      bottom: var(--spacer-lg);
      left: 50%;
      transform: translateX(-50%);
      z-index: var(--zoo-error-toast-z-index, var(--z-modal));
      display: flex;
      align-items: center;
      gap: var(--spacer-base);
      padding: var(--zoo-error-toast-padding, var(--spacer-sm) var(--spacer-base));
      background: var(--zoo-error-toast-background, var(--color-ink));
      color: var(--zoo-error-toast-color, var(--color-paper));
      border-radius: var(--radius-base);
      box-shadow: var(--shadow-card);
    }
    button {
      font: inherit;
      border: none;
      background: none;
      color: var(--color-savanna);
      cursor: pointer;
    }
  `,
})
export class ErrorToastComponent {
  protected readonly snackBar = inject(SnackBar);

  reportError(): void {
    this.snackBar.open(translate('errors.generic'), translate('errors.dismiss'));
  }
}
