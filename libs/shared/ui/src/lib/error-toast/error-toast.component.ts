import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SnackBar } from './snack-bar.service';

/**
 * BEFORE (anti-pattern): shared code owns its wording. "Something went wrong."
 * is wrong on the unattended ticket-kiosk terminal, but the string is hard-coded
 * here — see Task A for the i18n fix.
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
    this.snackBar.open('Something went wrong.', 'Dismiss');
  }
}
