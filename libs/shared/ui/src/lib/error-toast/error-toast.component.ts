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
})
export class ErrorToastComponent {
  protected readonly snackBar = inject(SnackBar);

  reportError(): void {
    this.snackBar.open(translate('errors.generic'), translate('errors.dismiss'));
  }
}
